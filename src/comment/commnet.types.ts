export type CommentData = {
  userId: number;
  postId: number;
  userName: string;
  content: string;
  parentId?: number;
};

export type CommentType = {
  id: number;
  parentId: number;
  userName: string;
  content: string;
  depth: number;
  group: number;
  order: number;
  createdTime: Date;
  updatedTime: Date;
};
