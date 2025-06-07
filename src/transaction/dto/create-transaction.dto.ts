import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { TransactionType } from '../transaction-type.enum';
import { ExpenseCategory, IncomeCategory } from 'src/category/category-type.entity';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Amount of the transaction' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Type of transaction (income or expense)', enum: TransactionType })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({ 
    description: 'Category of the transaction',
    enum: [...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)]
  })
  @IsEnum([...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)])
  @IsNotEmpty()
  category: IncomeCategory | ExpenseCategory;

  @ApiProperty({ description: 'Description of the transaction', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Date of the transaction' })
  @IsDate()
  @IsNotEmpty()
  date: Date;
} 