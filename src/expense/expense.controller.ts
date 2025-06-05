import { Expense } from './expense.entity';
import { Body, Controller, Post, UseGuards, Request, Get, Param, NotFoundException, Patch, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseValidator } from './validators/expense.validator';

@ApiTags('expense')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully.' })
  @ApiBearerAuth()
  async createExpense(@Request() req, @Body() expenseData: CreateExpenseDto): Promise<Expense> {
    const { date, ...rest } = expenseData;
    const expenseDate = new Date(date);
    ExpenseValidator.validateExpense(expenseData.amount, expenseData.category, expenseDate);
    return this.expenseService.create({ ...rest, date: expenseDate, user: req.user });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense found.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @ApiBearerAuth()
  async getExpense(@Param('id') id: number, @Request() req): Promise<Expense> {
    const expense = await this.expenseService.findOne(id, req.user.id);
    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }
    return expense;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @ApiBearerAuth()
  async updateExpense(@Param('id') id: number, @Body() data: UpdateExpenseDto, @Request() req): Promise<Expense> {
    const { date, ...rest } = data;
    const expenseDate = date ? new Date(date) : null;
    if (expenseDate) {
      ExpenseValidator.validateDate(expenseDate);
    }
    if (data.amount) {
      ExpenseValidator.validateAmount(data.amount);
    }
    if (data.category) {
      ExpenseValidator.validateCategory(data.category);
    }
    const updateData = expenseDate ? { ...rest, date: expenseDate } : rest;
    const expense = await this.expenseService.update(id, req.user.id, updateData);
    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }
    return expense;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  @ApiBearerAuth()
  async deleteExpense(@Param('id') id: number, @Request() req): Promise<void> {
    const expense = await this.expenseService.findOne(id, req.user.id);
    if (!expense) {
      throw new NotFoundException('Expense not found.');
    }
    await this.expenseService.remove(id);
  }
}