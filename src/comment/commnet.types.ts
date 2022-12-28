export type CommentData = {
  userId: number;
  postId: number;
  userName: string;
  content: string;
  parentId?: number;
};
