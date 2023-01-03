import * as express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
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

router.get("/kakao", async (req: express.Request, res: express.Response) => {
  const code = req.query.code.toString();
  if (!code) {
    return res
      .status(400)
      .send({ success: false, message: "올바르지 않은 코드입니다." });
  }
  const tokenResult = await authService.getToken(code, clientId, redirectUri);
  if (!tokenResult.sucess) {
    return res.status(401).send(tokenResult);
  }
  return res.send(tokenResult);
});

export default router;
