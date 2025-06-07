import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../../transaction/transaction-type.enum';
import { IncomeCategory, ExpenseCategory } from '../category-type.entity';

export class CreateCategoryDto {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ enum: [...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)] })
  @IsEnum([...Object.values(IncomeCategory), ...Object.values(ExpenseCategory)])
  name: IncomeCategory | ExpenseCategory;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
} 