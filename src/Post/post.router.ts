import * as express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { PostService } from "./post.service";

const router = express.Router();
const postService = new PostService();

router.post(
  "/write",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const postData = req.body;
    const writeResult = await postService.addPost(postData);
    if (!writeResult.success) {
      return res.status(400).send(writeResult);
    }
    return res.send(writeResult);
  }
);

router.get("/list", async (req: express.Request, res: express.Response) => {
  const postList = await postService.getList();

  if (!postList.success) {
    return res.status(400).send(postList);
  }
  return res.send(postList);
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const postId = Number(req.params.id);
  if (!postId) {
    return res
      .status(400)
      .send({ success: false, message: "게시글이 존재하지 않습니다" });
  }
  const postDetail = await postService.detailPost(postId);
  if (!postDetail.success) {
    return res.status(400).send(postDetail);
  }
  return res.send(postDetail);
});

export default router;
