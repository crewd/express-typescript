import * as express from "express";
import { kakaoAuthMiddleware } from "../middleware/auth.middleware";
import { AuthService } from "./auth.service";

const router = express.Router();
const authService = new AuthService();

router.post(
  "/kakao/login",
  kakaoAuthMiddleware,
  async (req: express.Request, res: express.Response) => {
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
  kakaoAuthMiddleware,
  async (req: express.Request, res: express.Response) => {
    const kakaoSignUpData = req.body;

    const kakaoSignUpResult = await authService.kakaoSignUp(kakaoSignUpData);

    if (!kakaoSignUpResult.success) {
      return res.status(401).send(kakaoSignUpResult);
    }

    return res.send(kakaoSignUpResult);
  }
);

export default router;
