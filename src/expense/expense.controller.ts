import { Expense } from './expense.entity';
import { Body, Controller, Post, UseGuards, Request, Get, Param, NotFoundException } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
    return this.expenseService.create({ ...rest, date: new Date(date), user: req.user });
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
}