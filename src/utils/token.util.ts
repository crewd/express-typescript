import * as jwt from "jsonwebtoken";
import { Jwk } from "../auth/auth.types";

const secretKey = process.env.SECRET_KEY;

export const tokenUtils = {
  sign: (id: number) => {
    const signToken = jwt.sign({ id: id }, secretKey);
    return signToken;
  },

  verify: (
    token: string,
    publicKey?: string
  ): { success: boolean; message: string; payload?: any } => {
    if (!token) {
      return { success: false, message: "유효하지 않은 토큰입니다." };
    }
    try {
      if (publicKey) {
        const payload = jwt.verify(token, publicKey);
        return { success: true, message: "인증 성공", payload: payload };
      }
      const payload = jwt.verify(token, secretKey);
      return { success: true, message: "인증 성공", payload: payload };
    } catch (err) {
      return { success: false, message: err };
    }
  },
};
