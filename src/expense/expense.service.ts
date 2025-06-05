import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "./expense.entity";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
  ) {}

  async create(data: Partial<Expense>): Promise<Expense> {
    const expense = this.expenseRepo.create(data);
    return await this.expenseRepo.save(expense);
  }

  async findOne(id: number, userId: number): Promise<Expense | null> {
    return this.expenseRepo.findOne({ where: { id, user: { id: userId } } });
  }
}