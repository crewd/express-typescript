import * as express from "express";
import axios, { AxiosError } from "axios";
import { tokenUtils } from "../utils/token.util";
import { KakaoToken } from "../auth/auth.types";

export const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers["authorization"].split("Bearer ")[1];
  const verifyToken = tokenUtils.verify(token);
  if (!verifyToken.success) {
    return res.status(401).send(verifyToken);
  }
  req.body.userId = verifyToken.payload?.id;
  return next();
};

export const kakaoAuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const code = req.query.code;
  const requestUrl = "https://kauth.kakao.com/oauth/token";
  const parameter = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_API_KEY,
    redirect_uri: "http://localhost:3000/auth/kakao",
    code: code,
  };

  try {
    const kakaoData = await axios.post(requestUrl, parameter, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const kakaoToken: KakaoToken = kakaoData.data;
    const verifyKakaoToken = tokenUtils.kakaoVerify(kakaoToken.id_token);

    if (!verifyKakaoToken.success) {
      return res.status(401).send(verifyKakaoToken);
    }
    req.body.kakaoToken = kakaoToken.access_token;
    req.body.kakaoUid = verifyKakaoToken.payload?.sub;

    return next();
  } catch (err) {
    const { message } = err as AxiosError;
    return res.status(401).send({ success: false, message: message });
  }
};
