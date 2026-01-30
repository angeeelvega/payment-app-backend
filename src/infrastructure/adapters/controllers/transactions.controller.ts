import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateTransactionPort,
  CREATE_TRANSACTION_PORT,
} from '@application/ports/in/create-transaction.port';
import {
  ProcessPaymentPort,
  PROCESS_PAYMENT_PORT,
} from '@application/ports/in/process-payment.port';
import {
  GetTransactionPort,
  GET_TRANSACTION_PORT,
} from '@application/ports/in/get-transaction.port';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { ProcessPaymentSecureDto } from './dtos/process-payment-secure.dto';
import { TransactionResponseDto, ErrorResponseDto } from './dtos/response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(
    @Inject(CREATE_TRANSACTION_PORT)
    private readonly createTransactionUseCase: CreateTransactionPort,
    @Inject(PROCESS_PAYMENT_PORT)
    private readonly processPaymentUseCase: ProcessPaymentPort,
    @Inject(GET_TRANSACTION_PORT)
    private readonly getTransactionUseCase: GetTransactionPort,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    this.logger.log(`Received request to create transaction`);
    this.logger.log(
      `Request data - Customer: ${createTransactionDto.customerEmail}, Product: ${createTransactionDto.productId}, Quantity: ${createTransactionDto.quantity}`,
    );

    const result = await this.createTransactionUseCase.execute(createTransactionDto);

    if (result.isFailure) {
      this.logger.error(`Failed to create transaction: ${result.error}`);
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    this.logger.log(
      `Transaction created successfully - ID: ${result.value.id}, Number: ${result.value.transactionNumber}`,
    );
    this.logger.log(`Transaction amount: ${result.value.totalAmount} COP`);

    return this.mapToTransactionResponse(result.value);
  }

  @Post(':id/payment')
  @ApiOperation({ summary: 'Process payment for a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    type: ErrorResponseDto,
  })
  async processPayment(
    @Param('id') transactionId: string,
    @Body() processPaymentDto: ProcessPaymentSecureDto,
  ): Promise<TransactionResponseDto> {
    this.logger.log(`Received payment request for transaction: ${transactionId}`);
    this.logger.log(
      `Payment details - Card holder: ${processPaymentDto.cardHolder}, Installments: ${processPaymentDto.installments}, Email: ${processPaymentDto.customerEmail}`,
    );

    const result = await this.processPaymentUseCase.execute({
      transactionId,
      ...processPaymentDto,
    });

    if (result.isFailure) {
      this.logger.error(`Payment failed for transaction ${transactionId}: ${result.error}`);
      const statusCode = result.error.includes('not found')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error, statusCode);
    }

    this.logger.log(
      `Payment completed successfully - Status: ${result.value.status}, Payment ID: ${result.value.paymentTransactionId}`,
    );

    return this.mapToTransactionResponse(result.value);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    type: ErrorResponseDto,
  })
  async getTransaction(@Param('id') transactionId: string): Promise<TransactionResponseDto> {
    this.logger.log(`Fetching transaction: ${transactionId}`);

    const result = await this.getTransactionUseCase.execute(transactionId);

    if (result.isFailure) {
      this.logger.warn(`Transaction not found: ${transactionId}`);
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    this.logger.log(
      `Transaction retrieved - Status: ${result.value.status}, Amount: ${result.value.totalAmount} COP`,
    );

    return this.mapToTransactionResponse(result.value);
  }

  private mapToTransactionResponse(transaction: any): TransactionResponseDto {
    return {
      id: transaction.id,
      transactionNumber: transaction.transactionNumber,
      customerEmail: transaction.customerEmail,
      customerFirstName: transaction.customerFirstName,
      customerLastName: transaction.customerLastName,
      customerAddress: transaction.customerAddress,
      customerDocumentId: transaction.customerDocumentId,
      customerCity: transaction.customerCity,
      productId: transaction.productId,
      quantity: transaction.quantity,
      productAmount: transaction.productAmount,
      baseFee: transaction.baseFee,
      deliveryFee: transaction.deliveryFee,
      totalAmount: transaction.totalAmount,
      status: transaction.status,
      paymentTransactionId: transaction.paymentTransactionId,
      paymentReference: transaction.paymentReference,
      paymentMethod: transaction.paymentMethod,
      statusMessage: transaction.statusMessage,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
