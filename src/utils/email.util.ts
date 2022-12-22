import Mailgun from "mailgun.js";
import * as formData from "form-data";

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_API_URL;
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "changcheon.ryu@gmail.com",
  key: apiKey,
});

export const sendEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const pattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (!pattern.test(email)) {
    return { success: false, message: "유효하지 않은 이메일입니다." };
  }
  const messageData = {
    from: "changcheon.ryu@gmail.com",
    to: email,
    subject: "회원가입 인증 메일",
    text: "인증 코드",
  };
  return client.messages
    .create(domain, messageData)
    .then((res) => {
      return { success: true, message: "이메일 전송 성공" };
    })
    .catch((err) => {
      return { success: false, message: "이메일 전송 실패" };
    });
};
