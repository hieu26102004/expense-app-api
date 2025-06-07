import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../transaction-type.enum';
import { IncomeCategory, ExpenseCategory } from '../../category/category-type.entity';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ 
    enum: [...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)]
  })
  @IsEnum([...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)])
  category: IncomeCategory | ExpenseCategory;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}