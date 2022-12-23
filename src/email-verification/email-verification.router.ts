import * as express from "express";
import { EmailVerificationService } from "./email-verification.service";

const router = express.Router();
const emailVerification = new EmailVerificationService();

router.post("/email", async (req: express.Request, res: express.Response) => {
  const email = req.body.email;

  if (!email) {
    return res
      .status(400)
      .send({ success: false, message: "올바른 이메일을 입력해 주세요" });
  }

  const sendEmail = await emailVerification.sendEmail(email);

  if (!sendEmail.success) {
    return res.status(400).send(sendEmail);
  }

  return res.send(sendEmail);
});

router.post("/verify", async (req: express.Request, res: express.Response) => {
  const email = req.body.email;
  const code = Number(req.body.code);
  if (!email) {
    return res
      .status(400)
      .send({ success: false, message: "올바른 이메일을 입력해 주세요" });
  }
  if (!code) {
    return res
      .status(400)
      .send({ success: false, message: "올바른 코드를 입력해 주세요" });
  }
  const verification = await emailVerification.verification(email, code);

  if (!verification.success) {
    return res.status(401).send(verification);
  }

  return res.send(verification);
});

export default router;
