import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // 카카오 null / 카카오 uid
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  kakaoUid: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// 인증용 테이블
// 인증번호, 인증여부, email, 만료시간
