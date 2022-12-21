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
    const userId = req.body.userId;
    const writeResult = await postService.addPost(userId, postData);
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
  const postDetail = await postService.getPost(postId);
  if (!postDetail.success) {
    return res.status(400).send(postDetail);
  }
  return res.send(postDetail);
});

router.patch(
  "/:id",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const postId = Number(req.params.id);
    const updateData = req.body;
    const userId = req.body.userId;
    if (!postId || !updateData) {
      return res
        .status(400)
        .send({ success: false, message: "올바른 정보를 입력해 주세요" });
    }
    const updatedData = await postService.updatePost(
      postId,
      updateData,
      userId
    );
    if (!updatedData.success) {
      return res.status(400).send(updatedData);
    }
    return res.send(updatedData);
  }
);

export default router;
