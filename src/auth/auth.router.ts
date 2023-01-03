import * as express from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const clientId = process.env.KAKAO_API_KEY;
const redirectUri = "http://localhost:3000/auth/kakao";

router.get(
  "/kakao/login",
  async (req: express.Request, res: express.Response) => {
    const kakaoLoginUrl = `https://kauth.kakao.com//oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    return res.redirect(kakaoLoginUrl);
  }
);

export default router;
