import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { CategoryModule } from '../category/category.module';
import { CategoryType } from '../category/category-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, CategoryType]),
    CategoryModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}