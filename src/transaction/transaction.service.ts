import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./transaction.entity";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepo.create(data);
    return await this.transactionRepo.save(transaction);
  }

  async findOne(id: number, userId: number): Promise<Transaction | null> {
    return this.transactionRepo.findOne({ where: { id, user: { id: userId } } });
  }

  async update(id: number, userId: number, data: Partial<Transaction>): Promise<Transaction | null> {
    const transaction = await this.findOne(id, userId);
    if (!transaction) return null;
    Object.assign(transaction, data);
    return this.transactionRepo.save(transaction);
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepo.delete(id);
  }
} 