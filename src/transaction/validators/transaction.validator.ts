import { BadRequestException } from '@nestjs/common';
import { IncomeCategory, ExpenseCategory } from '../category-type.entity';
import { TransactionType } from '../transaction-type.enum';

export class TransactionValidator {
  static validateTransaction(amount: number, type: TransactionType, category: IncomeCategory | ExpenseCategory, date: Date): void {
    this.validateAmount(amount);
    this.validateCategory(type, category);
    this.validateDate(date);
  }

  static validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
  }

  static validateCategory(type: TransactionType, category: IncomeCategory | ExpenseCategory): void {
    if (!category) {
      throw new BadRequestException('Category cannot be empty');
    }

    const incomeCategories = Object.values(IncomeCategory);
    const expenseCategories = Object.values(ExpenseCategory);

    if (type === TransactionType.INCOME && !incomeCategories.includes(category as IncomeCategory)) {
      throw new BadRequestException('Invalid category for income transaction');
    }

    if (type === TransactionType.EXPENSE && !expenseCategories.includes(category as ExpenseCategory)) {
      throw new BadRequestException('Invalid category for expense transaction');
    }
  }

  static validateDate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
  }
} 