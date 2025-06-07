import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionType } from '../transaction/transaction-type.enum';
import { User } from 'src/users/user.entity';

export enum IncomeCategory {
  SALARY = 'salary',
  BONUS = 'bonus',
  INVESTMENT = 'investment',
  FREELANCE = 'freelance',
  OTHER_INCOME = 'other_income'
}

export enum ExpenseCategory {
  FOOD = 'food',
  TRANSPORTATION = 'transportation',
  HOUSING = 'housing',
  UTILITIES = 'utilities',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  HEALTH = 'health',
  EDUCATION = 'education',
  TRAVEL = 'travel',
  OTHER_EXPENSE = 'other_expense'
}

@Entity()
export class CategoryType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: TransactionType.EXPENSE
  })
  type: TransactionType;

  @Column({
    type: 'varchar',
    length: 50
  })
  name: IncomeCategory | ExpenseCategory;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
} 