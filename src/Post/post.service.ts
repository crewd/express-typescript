export class PostService {
  async addPost(postData): Promise<{ success: boolean; message: string }> {
    if (!postData) {
      return { success: false, message: "NOT_DATA" };
    }
  }
}
