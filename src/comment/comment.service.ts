import { getConnection } from "typeorm";
import { Post } from "../post/post.entity";
import { Comment } from "./comment.entity";
import { CommentData } from "./commnet.types";

export class CommentService {
  async addComment(
    postId: number,
    userId: number,
    commentData: CommentData
  ): Promise<{ success: boolean; message: string; data? }> {
    const getPostResult = await getConnection()
      .getRepository(Post)
      .findOne({ id: postId });

    if (!getPostResult) {
      return { success: false, message: "게시물이 존재하지 않습니다" };
    }

    if (!commentData.content) {
      return { success: false, message: "내용을 입력해 주세요" };
    }

    const comment = new Comment();
    comment.content = commentData.content;
    comment.postId = postId;
    comment.userId = userId;
    comment.userName = commentData.userName;

    const groups = await getConnection()
      .getRepository(Comment)
      .find({ parentId: 0 });
    comment.group = groups.length + 1;

    const getCommentResult = await getConnection()
      .getRepository(Comment)
      .findOne({ id: commentData.parentId });

    if (!getCommentResult && commentData.parentId) {
      return { success: false, message: "없는 댓글입니다" };
    }

    if (commentData.parentId) {
      comment.parentId = commentData.parentId;
      comment.depth = getCommentResult.depth + 1;
      comment.group = getCommentResult.group;
    }

    await getConnection().manager.save(comment);

    const comments = await getConnection().getRepository(Comment).find();

    return { success: true, message: "댓글 작성" };
  }
}
