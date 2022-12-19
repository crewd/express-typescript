import { getConnection } from "typeorm";
import { Post } from "./post.entity";
import { PostData } from "./post.types";

export class PostService {
  async write(
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
    post.writer = postData.wirter;

    await getConnection().manager.save(post);

    return { success: true, message: "게시글 추가 완료" };
  }
}
