export type PostData = {
  writer: string;
  title: string;
  content: string;
};

export type PostList = {
  title: string;
  writer: string;
  createdTime: Date;
  updatedTime: Date;
};
