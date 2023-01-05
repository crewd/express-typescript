import axios, { AxiosError } from "axios";
import { getConnection } from "typeorm";
import { User } from "../user/user.entity";
import { tokenUtils } from "../utils/token.util";
import { KakaoSignUpData } from "./auth.types";

export class AuthService {
  async kakaoLogin(kakaoUid: string): Promise<{
    success: boolean;
    message: string;
    data?: {
      token: string;
      email: string;
      name: string;
    };
  }> {
    if (!kakaoUid) {
      return { success: false, message: "회원정보가 없습니다" };
    }
    const user = await getConnection()
      .getRepository(User)
      .findOne({ kakaoUid: kakaoUid });
    if (!user) {
      return {
        success: false,
        message: "가입된 회원이 아닙니다.",
      };
    }
    const signedToken = await tokenUtils.sign(user.id);

    return {
      success: true,
      message: "카카오 로그인 성공",
      data: {
        token: signedToken,
        email: user.email,
        name: user.name,
      },
    };
  }

  async kakaoSignUp(kakaoSignUpData: KakaoSignUpData) {
    if (!kakaoSignUpData.email) {
      return { success: false, message: "이메일을 입력해 주세요" };
    }

    if (!kakaoSignUpData.kakaoUid) {
      return {
        success: false,
        message: "카카오 회원 정보가 유효하지 않습니다",
      };
    }

    if (!kakaoSignUpData.name) {
      return { success: false, message: "이름을 입력해 주세요" };
    }

    if (!kakaoSignUpData.age) {
      return { success: false, message: "나이를 입력해 주세요" };
    }
    const checkedEmail = await getConnection()
      .getRepository(User)
      .findOne({ email: kakaoSignUpData.email });

    if (checkedEmail) {
      return { success: false, message: "이메일 중복" };
    }

    const checkedKakaoUid = await getConnection()
      .getRepository(User)
      .findOne({ kakaoUid: kakaoSignUpData.kakaoUid });

    if (checkedKakaoUid) {
      return { success: false, message: "이미 가입된 카카오 회원입니다." };
    }

    const user = new User();
    user.email = kakaoSignUpData.email;
    user.name = kakaoSignUpData.name;
    user.age = kakaoSignUpData.age;
    user.kakaoUid = kakaoSignUpData.kakaoUid;

    await getConnection().manager.save(user);
    return { success: true, message: "가입 완료" };
  }
}
