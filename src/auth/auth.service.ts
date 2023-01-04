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
      token?: string;
      email?: string;
      name?: string;
      kakaoUid?: string;
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
        data: { kakaoUid: kakaoUid },
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
        kakaoUid: kakaoUid,
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

    const user = new User();
    user.email = kakaoSignUpData.email;
    user.name = kakaoSignUpData.name;
    user.age = kakaoSignUpData.age;
    user.kakaoUid = kakaoSignUpData.kakaoUid;

    await getConnection().manager.save(user);
    return { success: true, message: "가입 완료" };
  }

  async kakaoLogOut(kakaoUid: string) {
    if (!kakaoUid) {
      return { success: false, message: "kakaoUid_false" };
    }
    const kakaoAdminKey = process.env.KAKAO_ADMIN_KEY;
    const logOutData = {
      target_id_type: "user_id",
      target_id: kakaoUid,
    };

    try {
      await axios.post("https://kapi.kakao.com/v1/user/logout", logOutData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          Authorization: `KakaoAK ${kakaoAdminKey}`,
        },
      });
      return { success: true, message: "로그아웃 성공" };
    } catch (err) {
      console.log(err);
      const { message } = err as AxiosError;
      return { success: false, message: message };
    }
  }
}
