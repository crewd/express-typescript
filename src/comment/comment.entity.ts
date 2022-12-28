import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { Post } from "../post/post.entity";
import { User } from "../user/user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @Column()
  userName: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  parentId: number;

  @Column({ default: 0 })
  depth: number;

  @Column()
  group: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: "postId", referencedColumnName: "id" })
  post: Post;

  @ManyToMany(() => User, (user) => user.id)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;
}
