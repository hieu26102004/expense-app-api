import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExpenseDto {
  @ApiProperty({ description: 'Số tiền chi tiêu' })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ description: 'Danh mục chi tiêu' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Mô tả chi tiêu' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Ngày chi tiêu' })
  @IsDateString()
  @IsOptional()
  date?: string;
} 