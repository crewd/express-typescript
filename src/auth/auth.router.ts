import * as express from "express";
import {
  authMiddleware,
  kakaoAuthMiddleware,
} from "../middleware/auth.middleware";
import { AuthService } from "./auth.service";

const router = express.Router();
const authService = new AuthService();

const clientId = process.env.KAKAO_API_KEY;
const redirectUri = "http://localhost:3000/auth/kakao";

router.get(
  "/kakao/login",
  async (req: express.Request, res: express.Response) => {
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    return res.redirect(kakaoLoginUrl);
  }
);

router.get(
  "/kakao",
  kakaoAuthMiddleware,
  async (req: express.Request, res: express.Response) => {
    const kakaoToken = req.body.kakaoToken;
    const kakaoUid = req.body.kakaoUid;

    const kakaoLoginResult = await authService.kakaoLogin(kakaoUid);

    if (!kakaoLoginResult.success) {
      return res.status(401).send(kakaoLoginResult);
    }
    return res.send(kakaoLoginResult);
  }
);

router.post(
  "/kakao/signup",
  async (req: express.Request, res: express.Response) => {
    const kakaoSignUpData = req.body;

    const kakaoSignUpResult = await authService.kakaoSignUp(kakaoSignUpData);

    if (!kakaoSignUpResult.success) {
      return res.status(400).send(kakaoSignUpResult);
    }

    return res.send(kakaoSignUpResult);
  }
);

export default router;
