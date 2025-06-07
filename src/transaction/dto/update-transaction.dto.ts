import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExpenseCategory, IncomeCategory } from 'src/category/category-type.entity';
import { TransactionType } from '../transaction-type.enum';

export class UpdateTransactionDto {
  @ApiProperty({ description: 'Amount of the transaction', required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ description: 'Type of transaction (income or expense)', enum: TransactionType, required: false })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({ 
    description: 'Category of the transaction',
    enum: [...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)],
    required: false 
  })
  @IsEnum([...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)])
  @IsOptional()
  category?: IncomeCategory | ExpenseCategory;

  @ApiProperty({ description: 'Description of the transaction', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Date of the transaction', required: false })
  @IsDate()
  @IsOptional()
  date?: Date;
} 