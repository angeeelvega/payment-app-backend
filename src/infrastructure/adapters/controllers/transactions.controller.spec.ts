import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
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
import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';
import { Result } from '@shared/result';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let createTransactionUseCase: jest.Mocked<CreateTransactionPort>;
  let processPaymentUseCase: jest.Mocked<ProcessPaymentPort>;
  let getTransactionUseCase: jest.Mocked<GetTransactionPort>;

  const mockTransaction = new Transaction(
    'txn-123',
    'TXN-001',
    'john@example.com',
    'John',
    'Doe',
    'Calle 123 #45-67',
    '1020304050',
    'Bogota',
    'product-1',
    2,
    100000,
    5000,
    8000,
    113000,
    TransactionStatus.PENDING,
  );

  const mockApprovedTransaction = new Transaction(
    'txn-123',
    'TXN-001',
    'john@example.com',
    'John',
    'Doe',
    'Calle 123 #45-67',
    '1020304050',
    'Bogota',
    'product-1',
    2,
    100000,
    5000,
    8000,
    113000,
    TransactionStatus.APPROVED,
    'payment-123',
    'ref-001',
    'CARD ****4242',
    'Payment approved',
  );

  beforeEach(async () => {
    const mockCreateTransactionUseCase = {
      execute: jest.fn(),
    };

    const mockProcessPaymentUseCase = {
      execute: jest.fn(),
    };

    const mockGetTransactionUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: CREATE_TRANSACTION_PORT,
          useValue: mockCreateTransactionUseCase,
        },
        {
          provide: PROCESS_PAYMENT_PORT,
          useValue: mockProcessPaymentUseCase,
        },
        {
          provide: GET_TRANSACTION_PORT,
          useValue: mockGetTransactionUseCase,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    createTransactionUseCase = module.get(CREATE_TRANSACTION_PORT);
    processPaymentUseCase = module.get(PROCESS_PAYMENT_PORT);
    getTransactionUseCase = module.get(GET_TRANSACTION_PORT);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    const createTransactionDto = {
      customerEmail: 'john@example.com',
      customerFirstName: 'John',
      customerLastName: 'Doe',
      customerAddress: 'Calle 123 #45-67',
      customerDocumentId: '1020304050',
      customerCity: 'Bogota',
      productId: 'product-1',
      quantity: 2,
    };

    it('should create transaction successfully', async () => {
      createTransactionUseCase.execute.mockResolvedValue(Result.ok(mockTransaction));

      const result = await controller.createTransaction(createTransactionDto);

      expect(result.id).toBe('txn-123');
      expect(result.transactionNumber).toBe('TXN-001');
      expect(result.status).toBe(TransactionStatus.PENDING);
      expect(createTransactionUseCase.execute).toHaveBeenCalledWith(createTransactionDto);
    });

    it('should throw BadRequest when creation fails', async () => {
      createTransactionUseCase.execute.mockResolvedValue(Result.fail('Product not found'));

      await expect(controller.createTransaction(createTransactionDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.createTransaction(createTransactionDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });
  });

  describe('processPayment', () => {
    const processPaymentDto = {
      cardToken: 'tok_test_12345',
      cardHolder: 'John Doe',
      installments: 1,
      customerEmail: 'john@example.com',
    };

    it('should process payment successfully', async () => {
      processPaymentUseCase.execute.mockResolvedValue(Result.ok(mockApprovedTransaction));

      const result = await controller.processPayment('txn-123', processPaymentDto);

      expect(result.status).toBe(TransactionStatus.APPROVED);
      expect(result.paymentTransactionId).toBe('payment-123');
      expect(processPaymentUseCase.execute).toHaveBeenCalledWith({
        transactionId: 'txn-123',
        ...processPaymentDto,
      });
    });

    it('should throw NotFound when transaction not found', async () => {
      processPaymentUseCase.execute.mockResolvedValue(
        Result.fail('Transaction not found: txn-123'),
      );

      await expect(controller.processPayment('txn-123', processPaymentDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.processPayment('txn-123', processPaymentDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw BadRequest when payment fails', async () => {
      processPaymentUseCase.execute.mockResolvedValue(Result.fail('Insufficient funds'));

      await expect(controller.processPayment('txn-123', processPaymentDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.processPayment('txn-123', processPaymentDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });
  });

  describe('getTransaction', () => {
    it('should return transaction successfully', async () => {
      getTransactionUseCase.execute.mockResolvedValue(Result.ok(mockApprovedTransaction));

      const result = await controller.getTransaction('txn-123');

      expect(result.id).toBe('txn-123');
      expect(result.status).toBe(TransactionStatus.APPROVED);
      expect(getTransactionUseCase.execute).toHaveBeenCalledWith('txn-123');
    });

    it('should throw NotFound when transaction not found', async () => {
      getTransactionUseCase.execute.mockResolvedValue(
        Result.fail('Transaction not found: txn-123'),
      );

      await expect(controller.getTransaction('txn-123')).rejects.toThrow(HttpException);
      await expect(controller.getTransaction('txn-123')).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });
});
