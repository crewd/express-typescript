import * as express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { LoginUser } from "./user.types";

export const router = express.Router();
const userService = new UserService();

// 회원가입
router.post("/signup", async (req: express.Request, res: express.Response) => {
  const signUpData: User = req.body;

  const signUpResult = await userService.signUp(signUpData);

  if (!signUpResult.success) {
    return res.status(401).send(signUpResult);
  }

  return res.send(signUpResult);
});

// 로그인
router.post("/login", async (req: express.Request, res: express.Response) => {
  const loginData: LoginUser = req.body;

  const logInResult = await userService.logIn(loginData);

  if (!logInResult.success) {
    return res.status(400).send(logInResult);
  }

  return res.send(logInResult);
});

router.get(
  "/list",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const userList = await userService.userList();

    if (!userList.success) {
      return res.status(401).send(userList);
    }

    return res.send(userList);
  }
);

export default router;
