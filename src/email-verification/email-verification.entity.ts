import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class EmailVerification {
  @PrimaryColumn()
  verificationCode: string;

  @Column()
  isVerified: boolean;

  @Column()
  email: string;

  @Column()
  expirationTime: Date;
}
