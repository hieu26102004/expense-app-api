import { Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CategoryTypeService } from './category-type.service';
import { TransactionType } from './transaction-type.enum';

@ApiTags('categories')
@Controller('categories')
export class CategoryTypeController {
  constructor(private readonly categoryTypeService: CategoryTypeService) {}

  @Post('initialize')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initialize all categories' })
  @ApiResponse({ status: 201, description: 'Categories initialized successfully.' })
  @ApiBearerAuth()
  async initializeCategories() {
    await this.categoryTypeService.initializeCategories();
    return { message: 'Categories initialized successfully' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  @ApiBearerAuth()
  async getAllCategories() {
    return this.categoryTypeService.getAllCategories();
  }

  @Get('by-type')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get categories by type' })
  @ApiResponse({ status: 200, description: 'Return categories filtered by type.' })
  @ApiBearerAuth()
  async getCategoriesByType(@Query('type') type: TransactionType) {
    return this.categoryTypeService.getCategoriesByType(type);
  }
}