import { Expense } from './expense.entity';
import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
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
}