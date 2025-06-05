import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OtpCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column()
  expiresAt: Date;
}
