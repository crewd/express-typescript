import Mailgun from "mailgun.js";
import * as formData from "form-data";
import { EmailVerification } from "./email-verification.entity";
import { getConnection } from "typeorm";
import { User } from "../user/user.entity";

export class EmailVerificationService {
  verifyEmail(email: string) {
    const pattern =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    return pattern.test(email);
  }

  async sendEmail(email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_API_URL;

    const verifyEmailResult = this.verifyEmail(email);

    if (!verifyEmailResult) {
      return { success: false, message: "이메일 형식이 바르지 않습니다" };
    }

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: "changcheon.ryu@gmail.com",
      key: apiKey,
    });

    const deleteData = await getConnection()
      .getRepository(EmailVerification)
      .findOne({ email: email });

    if (deleteData) {
      await getConnection().getRepository(EmailVerification).delete(deleteData);
    }

    const user = getConnection().getRepository(User).findOne({ email: email });

    if (user) {
      return { success: false, message: "가입된 이메일입니다" };
    }

    const randomNumber = Math.floor(Math.random() * 8999) + 1000;

    const verification = new EmailVerification();
    const date = new Date();

    verification.verificationCode = randomNumber.toString();
    verification.email = email;
    verification.isVerified = false;
    verification.expirationTime = new Date(
      date.setMinutes(date.getMinutes() + 3)
    );

    await getConnection().getRepository(EmailVerification).save(verification);

    const messageData = {
      from: "changcheon.ryu@gmail.com",
      to: verification.email,
      subject: "회원가입 인증 메일",
      text: `인증코드 ${verification.verificationCode}`,
    };

    return client.messages
      .create(domain, messageData)
      .then(() => {
        return { success: true, message: "이메일 전송 성공" };
      })
      .catch(() => {
        return { success: false, message: "이메일 전송 실패" };
      });
  }

  async verify(
    email: string,
    code: string
  ): Promise<{ success: boolean; message: string }> {
    const verification = await getConnection()
      .getRepository(EmailVerification)
      .findOne({ verificationCode: code });
    if (verification.email !== email) {
      return { success: false, message: "잘못된 이메일입니다" };
    }

    if (verification.verificationCode !== code) {
      return { success: false, message: "인증번호가 틀렸습니다." };
    }

    const date = new Date();

    if (verification.expirationTime < date) {
      return { success: false, message: "만료된 코드입니다." };
    }

    verification.isVerified = true;

    await getConnection().getRepository(EmailVerification).save(verification);

    return { success: true, message: "인증 완료" };
  }
}
