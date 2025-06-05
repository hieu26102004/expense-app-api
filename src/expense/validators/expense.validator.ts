import { BadRequestException } from '@nestjs/common';

export class ExpenseValidator {
  static validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0.');
    }
  }

  static validateCategory(category: string): void {
    if (!category || category.trim() === '') {
      throw new BadRequestException('Category cannot be empty.');
    }
  }

  static validateDate(date: Date): void {
    if (date > new Date()) {
      throw new BadRequestException('Date cannot be in the future.');
    }
  }

  static validateExpense(amount: number, category: string, date: Date): void {
    this.validateAmount(amount);
    this.validateCategory(category);
    this.validateDate(date);
  }
} 