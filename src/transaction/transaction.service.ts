import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { CategoryType } from '../category/category-type.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(CategoryType)
    private categoryRepo: Repository<CategoryType>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto & { user: any }): Promise<Transaction> {
    const category = await this.categoryRepo.findOne({
      where: { 
        name: createTransactionDto.category,
        type: createTransactionDto.type
      }
    });

    if (!category) {
      throw new NotFoundException(`Category ${createTransactionDto.category} not found for type ${createTransactionDto.type}`);
    }

    const transaction = this.transactionRepo.create({
      ...createTransactionDto,
      category
    });

    return this.transactionRepo.save(transaction);
  }

  async findAll(userId: number, getTransactionsDto: GetTransactionsDto) {
    const { page = 1, limit = 10, type, category, startDate, endDate, sortBy = 'date', sortDirection = 'DESC' } = getTransactionsDto;

    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (category) {
      queryBuilder.andWhere('category.name = :category', { category });
    }

    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
    }

    const validSortFields = ['date', 'amount', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
    queryBuilder.orderBy(`transaction.${sortField}`, sortDirection);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const total = await queryBuilder.getCount();
    const transactions = await queryBuilder.getMany();

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['category']
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: number, userId: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (updateTransactionDto.category) {
      const category = await this.categoryRepo.findOne({
        where: { 
          name: updateTransactionDto.category,
          type: updateTransactionDto.type || transaction.type
        }
      });
      if (!category) {
        throw new NotFoundException(`Category ${updateTransactionDto.category} not found`);
      }
      transaction.category = category;
    }

    Object.assign(transaction, { ...updateTransactionDto, category: transaction.category });
    return this.transactionRepo.save(transaction);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transactionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Transaction not found');
    }
  }
} 