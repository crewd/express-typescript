import * as jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

export const tokenUtils = {
  sign: (id: number) => {
    const signToken = jwt.sign({ id: id }, secretKey);
    return signToken;
  },

  verify: (token: string): { success: boolean; message: string } => {
    if (!token) {
      return { success: false, message: "유효하지 않은 토큰입니다." };
    }
    try {
      jwt.verify(token, secretKey);
      return { success: true, message: "인증 성공" };
    } catch (err) {
      return { success: false, message: "유효하지 않은 토큰입니다." };
    }
  },
};
