import "dotenv/config";
import { getConnection } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { LoginUser, SignUpData, Users } from "./user.types";
import { tokenUtils } from "../utils/token.util";
import Mailgun from "mailgun.js";
import * as formData from "form-data";

const saltRounds = process.env.SALT_ROUNDS;

export class UserService {
  async signUp(signUpData: SignUpData): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!signUpData.email) {
      return { success: false, message: "이메일을 입력해 주세요" };
    }

    if (!signUpData.password) {
      return { success: false, message: "비밀번호를 입력해 주세요" };
    }

    if (!signUpData.name) {
      return { success: false, message: "이름을 입력해 주세요" };
    }

    if (!signUpData.age) {
      return { success: false, message: "나이를 입력해 주세요" };
    }

    const checkEmail = await getConnection()
      .getRepository(User)
      .findOne({ email: signUpData.email });

    if (checkEmail) {
      return { success: false, message: "이메일 중복" };
    }

    const hashPassword = await bcrypt.hash(
      signUpData.password,
      Number(saltRounds)
    );

    const user = new User();
    user.email = signUpData.email;
    user.name = signUpData.name;
    user.password = hashPassword;
    user.age = signUpData.age;

    await getConnection().manager.save(user);

    return { success: true, message: "회원가입 완료" };
  }

  async logIn(loginData: LoginUser): Promise<{
    success: boolean;
    message: string;
    data?: { token: string; email: string; name: string };
  }> {
    const checkUser = await getConnection()
      .getRepository(User)
      .findOne({ email: loginData.email });

    if (!checkUser) {
      return { success: false, message: "계정 정보를 확인해 주세요" };
    }

    const checkPassword = await bcrypt.compare(
      loginData.password,
      checkUser.password
    );

    if (!checkPassword) {
      return { success: false, message: "비밀번호를 확인해 주세요" };
    }

    const signToken = await tokenUtils.sign(checkUser.id);

    return {
      success: true,
      message: "로그인 성공",
      data: {
        token: signToken,
        email: checkUser.email,
        name: checkUser.name,
      },
    };
  }
  async userList(): Promise<{
    success: boolean;
    message: string;
    data?: Users[];
  }> {
    const users = await getConnection().getRepository(User).find();
    const userInfo: Users[] = users.map((user) => {
      return {
        email: user.email,
        name: user.name,
      };
    });
    return { success: true, message: "유저 리스트", data: userInfo };
  }

  async sendEmail(email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_API_URL;

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: "changcheon.ryu@gmail.com",
      key: apiKey,
    });

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
      .then(() => {
        return { success: true, message: "이메일 전송 성공" };
      })
      .catch(() => {
        return { success: false, message: "이메일 전송 실패" };
      });
  }
}
