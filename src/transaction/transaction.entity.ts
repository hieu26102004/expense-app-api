import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { IncomeCategory, ExpenseCategory } from 'src/category/category-type.entity';
import { TransactionType } from './transaction-type.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

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
  category: IncomeCategory | ExpenseCategory;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 