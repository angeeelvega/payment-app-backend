import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionUseCase } from './get-transaction.use-case';
import {
  TransactionRepositoryPort,
  TRANSACTION_REPOSITORY_PORT,
} from '@application/ports/out/transaction-repository.port';
import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';

describe('GetTransactionUseCase', () => {
  let useCase: GetTransactionUseCase;
  let transactionRepository: jest.Mocked<TransactionRepositoryPort>;

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
    TransactionStatus.APPROVED,
    'payment-txn-123',
    'ref-001',
    'CARD ****4242',
    'Payment approved successfully',
  );

  beforeEach(async () => {
    const mockTransactionRepository = {
      findById: jest.fn(),
      findByTransactionNumber: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionUseCase,
        {
          provide: TRANSACTION_REPOSITORY_PORT,
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetTransactionUseCase>(GetTransactionUseCase);
    transactionRepository = module.get(TRANSACTION_REPOSITORY_PORT);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return transaction when found', async () => {
      transactionRepository.findById.mockResolvedValue(mockTransaction);

      const result = await useCase.execute('txn-123');

      expect(result.isSuccess).toBe(true);
      expect(result.value).toEqual(mockTransaction);
      expect(transactionRepository.findById).toHaveBeenCalledWith('txn-123');
    });

    it('should return failure when transaction not found', async () => {
      transactionRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute('non-existent-id');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Transaction not found: non-existent-id');
    });

    it('should return failure when repository throws error', async () => {
      transactionRepository.findById.mockRejectedValue(new Error('Database connection failed'));

      const result = await useCase.execute('txn-123');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Database connection failed');
    });

    it('should handle non-Error exceptions', async () => {
      transactionRepository.findById.mockRejectedValue('Unknown error');

      const result = await useCase.execute('txn-123');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Failed to fetch transaction');
    });
  });
});
