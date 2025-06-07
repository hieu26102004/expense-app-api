import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryType } from './category-type.entity';
import { TransactionType } from '../transaction/transaction-type.enum';
import { IncomeCategory, ExpenseCategory } from './category-type.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories', type: [CategoryType] })
  findAll(): Promise<CategoryType[]> {
    return this.categoryService.findAll();
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get categories by type' })
  @ApiResponse({ status: 200, description: 'Return categories by type', type: [CategoryType] })
  findByType(@Param('type') type: TransactionType): Promise<CategoryType[]> {
    return this.categoryService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Return category by id', type: CategoryType })
  findOne(@Param('id') id: string): Promise<CategoryType> {
    return this.categoryService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryType })
  create(
    @Body('type') type: TransactionType,
    @Body('name') name: IncomeCategory | ExpenseCategory,
    @Body('description') description?: string,
  ): Promise<CategoryType> {
    return this.categoryService.create(type, name, description);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryType })
  update(
    @Param('id') id: string,
    @Body('type') type: TransactionType,
    @Body('name') name: IncomeCategory | ExpenseCategory,
    @Body('description') description?: string,
  ): Promise<CategoryType> {
    return this.categoryService.update(+id, type, name, description);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(+id);
  }
} 