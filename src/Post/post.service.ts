import { getConnection } from "typeorm";
import { Post } from "./post.entity";
import { PostData, PostList } from "./post.types";

export class PostService {
  async addPost(
    userId: number,
    postData: PostData
  ): Promise<{ success: boolean; message: string }> {
    if (!postData.title) {
      return { success: false, message: "제목을 입력해 주세요" };
    }
    if (!postData.content) {
      return { success: false, message: "내용을 입력해 주세요" };
    }

    const post = new Post();
    post.title = postData.title;
    post.content = postData.content;
    post.writer = postData.writer;
    post.userId = userId;

    await getConnection().manager.save(post);

    return { success: true, message: "게시글 추가 완료" };
  }

  async getList(): Promise<{
    success: boolean;
    message: string;
    data?: PostList[];
  }> {
    const posts = await getConnection().getRepository(Post).find();
    const postList: PostList[] = posts.map((post) => {
      return {
        title: post.title,
        writer: post.writer,
        createdTime: post.createdAt,
        updatedTime: post.updatedAt,
      };
    });
    return { success: true, message: "게시글 목록", data: postList };
  }

  async getPost(
    postId: number
  ): Promise<{ success: boolean; message: string; data?: PostData }> {
    const post = await getConnection()
      .getRepository(Post)
      .findOne({ id: postId });
    if (!post) {
      return { success: false, message: "게시글이 존재하지 않습니다" };
    }
    return { success: true, message: "게시글 조회", data: post };
  }

  async updatePost(
    postId: number,
    updatedData: any,
    userId?: number
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    if (!postId || !updatedData) {
      return { success: false, message: "올바른 데이터를 입력해 주세요" };
    }

    const post = await getConnection()
      .getRepository(Post)
      .findOne({ id: postId });

    if (!post) {
      return { success: false, message: "올바른 데이터를 입력해 주세요" };
    }

    if (post.userId !== userId) {
      return { success: false, message: "권한이 없습니다" };
    }

    post.title = updatedData.title;
    post.content = updatedData.content;

    await getConnection().getRepository(Post).save(post);

    return { success: true, message: "게시글 수정 완료", data: post };
  }
}
