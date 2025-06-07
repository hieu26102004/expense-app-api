import { BadRequestException } from '@nestjs/common';
import { TransactionType } from '../transaction-type.enum';
import { IncomeCategory, ExpenseCategory } from '../../category/category-type.entity';

export class TransactionValidator {
  static validateTransaction(amount: number, type: TransactionType, category: IncomeCategory | ExpenseCategory, date: Date) {
    this.validateAmount(amount);
    this.validateDate(date);
    this.validateCategory(type, category);
  }

  static validateAmount(amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
  }

  static validateDate(date: Date) {
    if (date > new Date()) {
      throw new BadRequestException('Date cannot be in the future');
    }
  }

  static validateCategory(type: TransactionType, category: IncomeCategory | ExpenseCategory) {
    if (!category) {
      throw new BadRequestException('Category is required');
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
} 