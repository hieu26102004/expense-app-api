import { Expense } from '../expense/expense.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}
