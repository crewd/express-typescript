import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class EmailVerification {
  @PrimaryColumn()
  VerificationCode: number;

  @Column()
  certification: boolean;

  @Column()
  email: string;

  @Column()
  ExpirationTime: Date;
}
