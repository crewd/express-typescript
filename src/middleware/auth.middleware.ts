import * as express from "express";
import * as jwks from "jwks-rsa";
import { tokenUtils } from "../utils/token.util";

const jwksClient = new jwks.JwksClient({
  jwksUri: "https://kauth.kakao.com/.well-known/jwks.json",
  requestHeaders: {},
  timeout: 30000,
});

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
  req.body.userId = verifyToken.payload.id;
  return next();
};

export const kakaoAuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const kakaoIdToken = req.body.kakaoIdToken;

  const tokenHeader = kakaoIdToken.split(".")[0];

  const header = Buffer.from(tokenHeader, "base64");
  const decodedHeader = JSON.parse(header.toString());

  const kid = decodedHeader.kid;
  const key = await jwksClient.getSigningKey(kid);
  const signKey = key.getPublicKey();

  const verifyToken = tokenUtils.verify(kakaoIdToken, signKey, {
    issuer: "https://kauth.kakao.com",
    audience: process.env.KAKAO_API_KEY,
  });

  if (!verifyToken.success) {
    return res
      .status(401)
      .send({ success: false, message: verifyToken.message });
  }
  req.body.kakaoUid = verifyToken.payload?.sub;
  return next();
};
