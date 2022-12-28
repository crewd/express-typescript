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
    const userId = Number(req.body.userId);
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

export default router;
