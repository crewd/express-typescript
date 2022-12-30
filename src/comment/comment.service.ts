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

    const group = await getConnection()
      .getRepository(Comment)
      .find({ parentId: 0 });
    comment.group = group.length + 1;

    const parentComment = await getConnection()
      .getRepository(Comment)
      .findOne({ id: commentData.parentId });

    const childComments = await getConnection()
      .getRepository(Comment)
      .find({ parentId: commentData.parentId });

    if (!parentComment && commentData.parentId) {
      return { success: false, message: "없는 댓글입니다" };
    }

    if (commentData.parentId) {
      comment.parentId = commentData.parentId;
      comment.depth = parentComment.depth + 1;
      comment.group = parentComment.group;

      const getGroupsResult = await getConnection()
        .getRepository(Comment)
        .find({ group: comment.group });

      comment.order =
        parentComment.order === 0
          ? getGroupsResult.length
          : parentComment.order + childComments.length + 1;

      await getGroupsResult.map(async (data) => {
        if (comment.order <= data.order && data.parentId !== 0) {
          data.order += 1;
          await getConnection().getRepository(Comment).save(data);
        }
      });
    }

    await getConnection().getRepository(Comment).save(comment);

    const getCommentsResult = await getConnection()
      .getRepository(Comment)
      .find({ postId: postId });

    const comments = getCommentsResult.map((data) => {
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

    const sortCommentsResult = comments.sort(
      (a, b) => a.group - b.group || a.order - b.order
    );

    return {
      success: true,
      message: "댓글 작성 성공",
      data: sortCommentsResult,
    };
  }

  async getComments(
    postId: number
  ): Promise<{ success: boolean; message: string; data?: CommentType[] }> {
    const getCommentsResult = await getConnection()
      .getRepository(Comment)
      .find({ postId: postId });

    if (!getCommentsResult) {
      return { success: false, message: "댓글이 존재하지 않습니다" };
    }

    const comments = getCommentsResult.map((data) => {
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

    const sortCommentsResult = comments.sort(
      (a, b) => a.group - b.group || a.order - b.order
    );

    return {
      success: true,
      message: "댓글 리스트",
      data: sortCommentsResult,
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
