export type PostData = {
  writer: string;
  title: string;
  content: string;
};

export type PostDetail = {
  id: number;
  writer: string;
  title: string;
  content: string;
  createdTime: Date;
  updatedTime: Date;
};

export type PostList = {
  title: string;
  writer: string;
  createdTime: Date;
  updatedTime: Date;
};

export type UpdateData = {
  title: string;
  content: string;
};
