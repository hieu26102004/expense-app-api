import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CategoryType, IncomeCategory, ExpenseCategory } from './category-type.entity';
import { TransactionType } from '../transaction/transaction-type.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryType)
    private categoryRepository: Repository<CategoryType>,
  ) {}

  async findAll(userId?: number): Promise<CategoryType[]> {
    return this.categoryRepository.find({
      where: [
        { userId: IsNull() }, // System categories
        { userId: userId } // User's categories
      ]
    });
  }

  async findOne(id: number, userId?: number): Promise<CategoryType> {
    const category = await this.categoryRepository.findOne({ 
      where: { id }
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if user has permission to access this category
    if (category.userId !== null && category.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this category');
    }

    return category;
  }

  async findByType(type: TransactionType, userId?: number): Promise<CategoryType[]> {
    return this.categoryRepository.find({ 
      where: [
        { type, userId: IsNull() }, // System categories
        { type, userId: userId } // User's categories
      ]
    });
  }

  async findByNameAndType(name: IncomeCategory | ExpenseCategory, type: TransactionType, userId?: number): Promise<CategoryType> {
    const category = await this.categoryRepository.findOne({ 
      where: [
        { name, type, userId: IsNull() }, // System categories
        { name, type, userId: userId } // User's categories
      ]
    });

    if (!category) {
      throw new NotFoundException(`Category ${name} of type ${type} not found`);
    }

    return category;
  }

  async create(type: TransactionType, name: IncomeCategory | ExpenseCategory, userId?: number, description?: string): Promise<CategoryType> {
    const category = this.categoryRepository.create({
      type,
      name,
      userId,
      description
    });
    return this.categoryRepository.save(category);
  }

  async update(id: number, type: TransactionType, name: IncomeCategory | ExpenseCategory, userId?: number, description?: string): Promise<CategoryType> {
    const category = await this.findOne(id, userId);

    // Prevent modifying system categories
    if (category.userId === null) {
      throw new ForbiddenException('Cannot modify system categories');
    }

    category.type = type;
    category.name = name;
    if (description) {
      category.description = description;
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const category = await this.findOne(id, userId);

    // Prevent deleting system categories
    if (category.userId === null) {
      throw new ForbiddenException('Cannot delete system categories');
    }

    const result = await this.categoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async removeUserCategories(userId: number): Promise<void> {
    await this.categoryRepository.softDelete({ userId });
  }
} 