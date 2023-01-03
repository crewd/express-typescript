import { getConnection } from "typeorm";
import { Post } from "../post/post.entity";
import { Comment } from "./comment.entity";
import { CommentData, CommentType } from "./commnet.types";

export class CommentService {
  async addComment(
    postId: number,
    userId: number,
    commentData: CommentData
  ): Promise<{ success: boolean; message: string; data?: CommentType[] }> {
    const post = await getConnection()
      .getRepository(Post)
      .findOne({ id: postId });

    if (!post) {
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

    const group = await getConnection()
      .getRepository(Comment)
      .find({ parentId: 0 });
    comment.group = group.length + 1;

    const parentComment = await getConnection()
      .getRepository(Comment)
      .findOne({ id: commentData.parentId });

    if (!parentComment && commentData.parentId) {
      return { success: false, message: "없는 댓글입니다" };
    }

    if (commentData.parentId) {
      comment.parentId = commentData.parentId;
      comment.depth = parentComment.depth + 1;
      comment.group = parentComment.group;

      const groups = await getConnection()
        .getRepository(Comment)
        .find({ group: comment.group });

      const childComments = await getConnection()
        .getRepository(Comment)
        .find({ parentId: commentData.parentId });

      comment.order =
        parentComment.order === 0
          ? groups.length
          : parentComment.order + childComments.length + 1;

      await groups.map(async (data) => {
        if (comment.order <= data.order && data.parentId !== 0) {
          data.order += 1;
          await getConnection().getRepository(Comment).save(data);
        }
      });
    }

    await getConnection().getRepository(Comment).save(comment);

    const commentsData = await getConnection()
      .getRepository(Comment)
      .find({ postId: postId });

    const comments = commentsData.map((data) => {
      return {
        id: data.id,
        parentId: data.parentId,
        userName: data.userName,
        content: data.content,
        depth: data.depth,
        group: data.group,
        order: data.order,
        createdTime: data.createdAt,
        updatedTime: data.updatedAt,
      };
    });

    const sortedComments = comments.sort(
      (a, b) => a.group - b.group || a.order - b.order
    );

    return {
      success: true,
      message: "댓글 작성 성공",
      data: sortedComments,
    };
  }

  async getComments(
    postId: number
  ): Promise<{ success: boolean; message: string; data?: CommentType[] }> {
    const commentsData = await getConnection()
      .getRepository(Comment)
      .find({ postId: postId });

    if (!commentsData) {
      return { success: false, message: "댓글이 존재하지 않습니다" };
    }

    const comments = commentsData.map((data) => {
      return {
        id: data.id,
        parentId: data.parentId,
        userName: data.userName,
        content: data.content,
        depth: data.depth,
        group: data.group,
        order: data.order,
        createdTime: data.createdAt,
        updatedTime: data.updatedAt,
      };
    });

    const sortedComments = comments.sort(
      (a, b) => a.group - b.group || a.order - b.order
    );

    return {
      success: true,
      message: "댓글 리스트",
      data: sortedComments,
    };
  }

  async updateComment(
    commentId: number,
    userId: number,
    updateData: { content: string }
  ): Promise<{ success: boolean; message: string }> {
    const comment = await getConnection()
      .getRepository(Comment)
      .findOne({ id: commentId });

    if (!comment) {
      return { success: false, message: "댓글을 찾을 수 없습니다" };
    }

    if (userId !== comment.userId) {
      return { success: false, message: "권한이 없습니다" };
    }

    comment.content = updateData.content;
    await getConnection().getRepository(Comment).save(comment);

    return { success: true, message: "댓글 수정 완료" };
  }

  async deleteComment(
    commentId: number,
    userId: number
  ): Promise<{ success: boolean; message: string }> {
    const comment = await getConnection()
      .getRepository(Comment)
      .findOne({ id: commentId });

    if (!comment) {
      return { success: false, message: "댓글을 찾을 수 없습니다" };
    }

    if (userId !== comment.userId) {
      return { success: false, message: "권한이 없습니다" };
    }

    await getConnection().getRepository(Comment).delete({ id: commentId });
    return { success: true, message: "댓글 삭제 완료" };
  }
}
