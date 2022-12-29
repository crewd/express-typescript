import * as express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { CommentService } from "./comment.service";

const router = express.Router();
const commentService = new CommentService();

router.post(
  "/:id",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const postId = Number(req.params.id);

    if (!postId) {
      return res
        .status(400)
        .send({ success: false, message: "게시글 번호를 확인해 주세요" });
    }
    const userId = Number(req.body.userId);

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "유저 정보를 확인해 주세요" });
    }
    const commentData = req.body;
    const addComment = await commentService.addComment(
      postId,
      userId,
      commentData
    );
    if (!addComment.success) {
      return res.status(400).send(addComment);
    }
    return res.send(addComment);
  }
);

router.get("/list/:id", async (req: express.Request, res: express.Response) => {
  const postId = Number(req.params.id);
  if (!postId) {
    return res
      .status(400)
      .send({ success: false, message: "게시글 번호를 확인해 주세요" });
  }
  const addComment = await commentService.getComments(postId);

  return res.send(addComment);
});

export default router;
