import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryType, IncomeCategory, ExpenseCategory } from './category-type.entity';
import { TransactionType } from '../transaction/transaction-type.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryType)
    private categoryRepository: Repository<CategoryType>,
  ) {}

  async findAll(): Promise<CategoryType[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<CategoryType> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findByType(type: TransactionType): Promise<CategoryType[]> {
    return this.categoryRepository.find({ where: { type } });
  }

  async findByNameAndType(name: IncomeCategory | ExpenseCategory, type: TransactionType): Promise<CategoryType> {
    const category = await this.categoryRepository.findOne({ where: { name, type } });
    if (!category) {
      throw new NotFoundException(`Category ${name} of type ${type} not found`);
    }
    return category;
  }

  async create(type: TransactionType, name: IncomeCategory | ExpenseCategory, description?: string): Promise<CategoryType> {
    const category = this.categoryRepository.create({
      type,
      name,
      description
    });
    return this.categoryRepository.save(category);
  }

  async update(id: number, type: TransactionType, name: IncomeCategory | ExpenseCategory, description?: string): Promise<CategoryType> {
    const category = await this.findOne(id);
    category.type = type;
    category.name = name;
    if (description) {
      category.description = description;
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
} 