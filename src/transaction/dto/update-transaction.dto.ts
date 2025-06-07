import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../transaction-type.enum';
import { IncomeCategory, ExpenseCategory } from '../../category/category-type.entity';

export class UpdateTransactionDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ enum: TransactionType, required: false })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({ 
    enum: [...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)],
    required: false 
  })
  @IsEnum([...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)])
  @IsOptional()
  category?: IncomeCategory | ExpenseCategory;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;
} 