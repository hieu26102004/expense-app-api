import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType, IncomeCategory, ExpenseCategory } from './category-type.entity';
import { TransactionType } from './transaction-type.enum';

@Injectable()
export class CategoryTypeService {
  constructor(
    @InjectRepository(CategoryType)
    private categoryTypeRepository: Repository<CategoryType>,
  ) {}

  async initializeCategories() {
    // Initialize Income Categories
    for (const category of Object.values(IncomeCategory)) {
      await this.categoryTypeRepository.save({
        type: TransactionType.INCOME,
        name: category,
        description: this.getCategoryDescription(category, TransactionType.INCOME)
      });
    }

    // Initialize Expense Categories
    for (const category of Object.values(ExpenseCategory)) {
      await this.categoryTypeRepository.save({
        type: TransactionType.EXPENSE,
        name: category,
        description: this.getCategoryDescription(category, TransactionType.EXPENSE)
      });
    }
  }

  private getCategoryDescription(category: string, type: TransactionType): string {
    const descriptions: { [key: string]: string } = {
      // Income Categories
      [IncomeCategory.SALARY]: 'Regular salary from employment',
      [IncomeCategory.BONUS]: 'Additional bonus payments',
      [IncomeCategory.INVESTMENT]: 'Income from investments',
      [IncomeCategory.FREELANCE]: 'Income from freelance work',
      [IncomeCategory.OTHER_INCOME]: 'Other sources of income',

      // Expense Categories
      [ExpenseCategory.FOOD]: 'Food and groceries expenses',
      [ExpenseCategory.TRANSPORTATION]: 'Transportation and travel expenses',
      [ExpenseCategory.HOUSING]: 'Housing and rent expenses',
      [ExpenseCategory.UTILITIES]: 'Utility bills and services',
      [ExpenseCategory.ENTERTAINMENT]: 'Entertainment and leisure expenses',
      [ExpenseCategory.SHOPPING]: 'Shopping and retail expenses',
      [ExpenseCategory.HEALTH]: 'Healthcare and medical expenses',
      [ExpenseCategory.EDUCATION]: 'Education and learning expenses',
      [ExpenseCategory.TRAVEL]: 'Travel and vacation expenses',
      [ExpenseCategory.OTHER_EXPENSE]: 'Other miscellaneous expenses'
    };

    return descriptions[category] || `${type} category`;
  }

  async getAllCategories() {
    return this.categoryTypeRepository.find();
  }

  async getCategoriesByType(type: TransactionType) {
    return this.categoryTypeRepository.find({ where: { type } });
  }
}

