import * as express from "express";
import { tokeMiddleware } from "../middleware/user.middleware";
import { tokenUtils } from "../utils/token.util";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { LoginUser } from "./user.types";

const router = express.Router();

// 회원가입
router.post("/signup", async (req: express.Request, res: express.Response) => {
  const signUpData: User = req.body;

  const userService = new UserService();
  const signUpResult = await userService.signUp(signUpData);

  if (!signUpResult.success) {
    return res.status(400).send(signUpResult);
  }

  return res.send(signUpResult);
});

// 로그인
router.post("/login", async (req: express.Request, res: express.Response) => {
  const loginData: LoginUser = req.body;

  const userService = new UserService();
  const logInResult = await userService.logIn(loginData);

  if (!logInResult.success) {
    return res.status(400).send(logInResult);
  }

  return res.send(logInResult);
});

router.get(
  "/list",
  tokeMiddleware,
  async (req: express.Request, res: express.Response) => {
    const userService = new UserService();
    const userList = await userService.userList();

    if (!userList.success) {
      return res.status(400).send(userList);
    }

    return res.send(userList);
  }
);

export default router;
