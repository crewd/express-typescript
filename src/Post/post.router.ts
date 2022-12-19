import * as express from "express";
import { authMiddleware } from "../middleware/user.middleware";
import { PostService } from "./post.service";

const router = express.Router();
const postService = new PostService();

router.post(
  "/write",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const postData = req.body;
    const writeResult = await postService.write(postData);
    if (!writeResult.success) {
      return res.status(400).send(writeResult);
    }
    return res.send(writeResult);
  }
);

export default router;
