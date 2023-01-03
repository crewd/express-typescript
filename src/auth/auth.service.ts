import axios, { AxiosError } from "axios";
import { KakaoToken } from "./auth.types";

export class AuthService {
  async getToken(
    code: string,
    clientId: string,
    redirectUri: string
  ): Promise<{
    sucess: boolean;
    message: string;
    data?: { access_token: string };
  }> {
    const requestUrl = "https://kauth.kakao.com/oauth/token";
    const parameter = {
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code,
    };

    try {
      const kakaoToken = await axios.post(requestUrl, parameter, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      return {
        sucess: true,
        message: "get_token_success",
        data: { access_token: kakaoToken.data.access_token },
      };
    } catch (err) {
      const { message } = err as AxiosError;
      return { sucess: false, message: message };
    }
  }
}
