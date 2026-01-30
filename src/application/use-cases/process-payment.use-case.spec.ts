import { Test, TestingModule } from '@nestjs/testing';
import { ProcessPaymentUseCase } from './process-payment.use-case';
import {
  TransactionRepositoryPort,
  TRANSACTION_REPOSITORY_PORT,
} from '@application/ports/out/transaction-repository.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';
import {
  DeliveryRepositoryPort,
  DELIVERY_REPOSITORY_PORT,
} from '@application/ports/out/delivery-repository.port';
import {
  PaymentGatewayPort,
  PAYMENT_GATEWAY_PORT,
} from '@application/ports/out/payment-gateway.port';
import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';
import { Product } from '@domain/entities/product.entity';
import { ProcessPaymentCommand } from '@application/ports/in/process-payment.port';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let transactionRepository: jest.Mocked<TransactionRepositoryPort>;
  let productRepository: jest.Mocked<ProductRepositoryPort>;
  let deliveryRepository: jest.Mocked<DeliveryRepositoryPort>;
  let paymentGateway: jest.Mocked<PaymentGatewayPort>;

  const createMockTransaction = (status: TransactionStatus = TransactionStatus.PENDING) =>
    new Transaction(
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
      status,
    );

  const mockProduct = new Product('product-1', 'iPhone 15', 'Latest iPhone', 100000, 10);

  const validCommand: ProcessPaymentCommand = {
    transactionId: 'txn-123',
    cardToken: 'tok_test_12345',
    cardHolder: 'John Doe',
    installments: 1,
    customerEmail: 'john@example.com',
  };

  beforeEach(async () => {
    const mockTransactionRepository = {
      findById: jest.fn(),
      findByTransactionNumber: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockDeliveryRepository = {
      findById: jest.fn(),
      findByTransactionId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockPaymentGateway = {
      processPayment: jest.fn(),
      getTransactionStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        {
          provide: TRANSACTION_REPOSITORY_PORT,
          useValue: mockTransactionRepository,
        },
        {
          provide: PRODUCT_REPOSITORY_PORT,
          useValue: mockProductRepository,
        },
        {
          provide: DELIVERY_REPOSITORY_PORT,
          useValue: mockDeliveryRepository,
        },
        {
          provide: PAYMENT_GATEWAY_PORT,
          useValue: mockPaymentGateway,
        },
      ],
    }).compile();

    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
    transactionRepository = module.get(TRANSACTION_REPOSITORY_PORT);
    productRepository = module.get(PRODUCT_REPOSITORY_PORT);
    deliveryRepository = module.get(DELIVERY_REPOSITORY_PORT);
    paymentGateway = module.get(PAYMENT_GATEWAY_PORT);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should process payment successfully', async () => {
      const transaction = createMockTransaction();
      transactionRepository.findById.mockResolvedValue(transaction);
      transactionRepository.update.mockResolvedValue(transaction);
      productRepository.findById.mockResolvedValue(mockProduct);
      productRepository.update.mockResolvedValue(mockProduct);
      deliveryRepository.save.mockResolvedValue({} as any);
      paymentGateway.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'payment-txn-123',
        reference: 'ref-001',
        status: 'APPROVED',
      });

      const result = await useCase.execute(validCommand);

      expect(result.isSuccess).toBe(true);
      expect(paymentGateway.processPayment).toHaveBeenCalledWith({
        amount: 113000,
        currency: 'COP',
        cardToken: 'tok_test_12345',
        cardHolder: 'John Doe',
        installments: 1,
        reference: 'TXN-001',
        customerEmail: 'john@example.com',
      });
    });

    it('should return failure when transaction not found', async () => {
      transactionRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute(validCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Transaction not found: txn-123');
    });

    it('should return failure when transaction is not pending', async () => {
      const approvedTransaction = createMockTransaction(TransactionStatus.APPROVED);
      transactionRepository.findById.mockResolvedValue(approvedTransaction);

      const result = await useCase.execute(validCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Transaction is not in pending status');
    });

    it('should return failure for invalid card token format', async () => {
      const transaction = createMockTransaction();
      transactionRepository.findById.mockResolvedValue(transaction);
      transactionRepository.update.mockResolvedValue(transaction);

      const invalidCommand = { ...validCommand, cardToken: 'invalid_token' };
      const result = await useCase.execute(invalidCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Invalid card token format. Must start with "tok_"');
    });

    it('should return failure for empty card token', async () => {
      const transaction = createMockTransaction();
      transactionRepository.findById.mockResolvedValue(transaction);
      transactionRepository.update.mockResolvedValue(transaction);

      const invalidCommand = { ...validCommand, cardToken: '' };
      const result = await useCase.execute(invalidCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Invalid card token format. Must start with "tok_"');
    });

    it('should return failure when payment is declined', async () => {
      const transaction = createMockTransaction();
      transactionRepository.findById.mockResolvedValue(transaction);
      transactionRepository.update.mockResolvedValue(transaction);
      paymentGateway.processPayment.mockResolvedValue({
        success: false,
        errorMessage: 'Insufficient funds',
      });

      const result = await useCase.execute(validCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Insufficient funds');
    });

    it('should return failure with default message when payment declined without error message', async () => {
      const transaction = createMockTransaction();
      transactionRepository.findById.mockResolvedValue(transaction);
      transactionRepository.update.mockResolvedValue(transaction);
      paymentGateway.processPayment.mockResolvedValue({
        success: false,
      });

      const result = await useCase.execute(validCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Payment declined');
    });

    it('should handle payment success without product found', async () => {
      const transaction = createMockTransaction();
      transactionRepository.findById.mockResolvedValue(transaction);
      transactionRepository.update.mockResolvedValue(transaction);
      productRepository.findById.mockResolvedValue(null);
      deliveryRepository.save.mockResolvedValue({} as any);
      paymentGateway.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'payment-txn-123',
        reference: 'ref-001',
      });

      const result = await useCase.execute(validCommand);

      expect(result.isSuccess).toBe(true);
      expect(productRepository.update).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
      transactionRepository.findById.mockRejectedValue(new Error('Database error'));

      const result = await useCase.execute(validCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Database error');
    });

    it('should handle non-Error exceptions', async () => {
      transactionRepository.findById.mockRejectedValue('Unknown error');

      const result = await useCase.execute(validCommand);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Failed to process payment');
    });

    it('should use transaction number as reference when payment reference is not provided', async () => {
      const transaction = createMockTransaction();
      transactionRepository.findById.mockResolvedValue(transaction);
      transactionRepository.update.mockResolvedValue(transaction);
      productRepository.findById.mockResolvedValue(mockProduct);
      productRepository.update.mockResolvedValue(mockProduct);
      deliveryRepository.save.mockResolvedValue({} as any);
      paymentGateway.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'payment-txn-123',
      });

      const result = await useCase.execute(validCommand);

      expect(result.isSuccess).toBe(true);
    });
  });
});
