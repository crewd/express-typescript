import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "../post/post.entity";
import { User } from "../user/user.entity";

@Entity()
export class Comment {
  @PrimaryColumn()
  commentId: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @Column()
  userName: string;

  @Column()
  content: string;

  @Column()
  group: number;

  @Column()
  depth: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: "postId", referencedColumnName: "id" })
  post: Post;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;
}
