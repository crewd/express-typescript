import * as express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { CommentService } from "./comment.service";

const router = express.Router();
const commentService = new CommentService();

router.post(
  "/post/:postId/comment",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const postId = Number(req.params.postId);

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

router.get(
  "/post/:postId/comments",
  async (req: express.Request, res: express.Response) => {
    const postId = Number(req.params.postId);
    if (!postId) {
      return res
        .status(400)
        .send({ success: false, message: "게시글 번호를 확인해 주세요" });
    }
    const addComment = await commentService.getComments(postId);

    if (!addComment.success) {
      return res.status(400).send(addComment);
    }

    return res.send(addComment);
  }
);

router.patch(
  "/comments/:commentId",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const commentId = Number(req.params.commentId);
    const userId = Number(req.body.userId);
    const updateData = req.body;

    if (!commentId) {
      return res
        .status(400)
        .send({ success: false, message: "댓글 번호를 확인해 주세요" });
    }

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "잘못된 유저입니다" });
    }

    if (!updateData) {
      return res
        .status(400)
        .send({ success: false, message: "수정할 내용을 확인해 주세요" });
    }
    const updateComment = await commentService.updateComment(
      commentId,
      userId,
      updateData
    );

    if (!updateComment.success) {
      return res.status(400).send(updateComment);
    }
    return res.send(updateComment);
  }
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const commentId = Number(req.params.commentId);
    const userId = Number(req.body.userId);

    if (!commentId) {
      return res
        .status(400)
        .send({ success: false, message: "댓글 번호를 확인해 주세요" });
    }
    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "잘못된 유저입니다" });
    }

    const deleteComment = await commentService.deleteComment(commentId, userId);

    if (!deleteComment.success) {
      return res.status(400).send(deleteComment);
    }
    return res.send(deleteComment);
  }
);

export default router;
