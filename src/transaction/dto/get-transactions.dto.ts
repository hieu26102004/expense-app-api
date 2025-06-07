import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDate, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../transaction-type.enum';

export class GetTransactionsDto {
  @ApiProperty({ required: false, description: 'Page number (starts from 1)' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Number of items per page' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ required: false, enum: TransactionType, description: 'Filter by transaction type' })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({ required: false, description: 'Filter by category name' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false, description: 'Filter by start date' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false, description: 'Filter by end date' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ required: false, description: 'Sort by field (e.g., date, amount)' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'date';

  @ApiProperty({ required: false, description: 'Sort direction (ASC or DESC)' })
  @IsString()
  @IsOptional()
  sortDirection?: 'ASC' | 'DESC' = 'DESC';
} 