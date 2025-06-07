
import { Body, Controller, Post, UseGuards, Request, Get, Param, NotFoundException, Patch, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransactionValidator } from './validators/transaction.validator';
import { Transaction } from "./transaction.entity";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully.' })
  @ApiBearerAuth()
  async createTransaction(@Request() req, @Body() transactionData: CreateTransactionDto): Promise<Transaction> {
    const { date, ...rest } = transactionData;
    const transactionDate = new Date(date);
    TransactionValidator.validateTransaction(
      transactionData.amount,
      transactionData.type,
      transactionData.category,
      transactionDate
    );
    return this.transactionService.create({ ...rest, date: transactionDate, user: req.user });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a Transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction found.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiBearerAuth()
  async getTransaction(@Param('id') id: number, @Request() req): Promise<Transaction> {
    const transaction = await this.transactionService.findOne(id, req.user.id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    return transaction;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiBearerAuth()
  async updateTransaction(@Param('id') id: number, @Body() data: UpdateTransactionDto, @Request() req): Promise<Transaction> {
    const { date, ...rest } = data;
    const transactionDate = date ? new Date(date) : null;
    if (transactionDate) {
      TransactionValidator.validateDate(transactionDate);
    }
    if (data.amount) {
      TransactionValidator.validateAmount(data.amount);
    }
    if (data.category && data.type) {
      TransactionValidator.validateCategory(data.type, data.category);
    }
    const updateData = transactionDate ? { ...rest, date: transactionDate } : rest;
    const transaction = await this.transactionService.update(id, req.user.id, updateData);
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    return transaction;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  @ApiBearerAuth()
  async deleteTransaction(@Param('id') id: number, @Request() req): Promise<void> {
    const transaction = await this.transactionService.findOne(id, req.user.id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }
    await this.transactionService.remove(id);
  }
} 