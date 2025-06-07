import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryType } from './category-type.entity';
import { TransactionType } from '../transaction/transaction-type.enum';
import { IncomeCategory, ExpenseCategory } from './category-type.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories', type: [CategoryType] })
  findAll(@Request() req): Promise<CategoryType[]> {
    return this.categoryService.findAll(req.user?.id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get categories by type' })
  @ApiResponse({ status: 200, description: 'Return categories by type', type: [CategoryType] })
  findByType(@Param('type') type: TransactionType, @Request() req): Promise<CategoryType[]> {
    return this.categoryService.findByType(type, req.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Return category by id', type: CategoryType })
  findOne(@Param('id') id: string, @Request() req): Promise<CategoryType> {
    return this.categoryService.findOne(+id, req.user?.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryType })
  create(
    @Request() req,
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryType> {
    return this.categoryService.create(
      createCategoryDto.type,
      createCategoryDto.name,
      req.user?.id,
      createCategoryDto.description
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryType })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: CreateCategoryDto
  ): Promise<CategoryType> {
    return this.categoryService.update(
      +id,
      updateCategoryDto.type,
      updateCategoryDto.name,
      req.user?.id,
      updateCategoryDto.description
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.categoryService.remove(+id, req.user?.id);
  }
} 