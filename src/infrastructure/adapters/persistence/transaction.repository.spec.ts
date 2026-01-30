import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from './transaction.repository';
import { TransactionSchema } from '@infrastructure/database/entities/transaction.schema';
import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<TransactionSchema>>;

  const mockSchema: TransactionSchema = {
    id: 'txn-123',
    transactionNumber: 'TXN-001',
    customerEmail: 'john@example.com',
    customerFirstName: 'John',
    customerLastName: 'Doe',
    customerAddress: 'Calle 123 #45-67',
    customerDocumentId: '1020304050',
    customerCity: 'Bogota',
    productId: 'product-1',
    quantity: 2,
    productAmount: 100000,
    baseFee: 5000,
    deliveryFee: 8000,
    totalAmount: 113000,
    status: 'PENDING',
    paymentTransactionId: '',
    paymentReference: '',
    paymentMethod: '',
    statusMessage: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: getRepositoryToken(TransactionSchema),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(TransactionSchema));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return transaction when found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findById('txn-123');

      expect(result).toBeInstanceOf(Transaction);
      expect(result?.id).toBe('txn-123');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'txn-123' } });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByTransactionNumber', () => {
    it('should return transaction when found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findByTransactionNumber('TXN-001');

      expect(result).toBeInstanceOf(Transaction);
      expect(result?.transactionNumber).toBe('TXN-001');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { transactionNumber: 'TXN-001' },
      });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByTransactionNumber('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save and return transaction', async () => {
      mockTypeOrmRepository.save.mockResolvedValue(mockSchema);

      const transaction = new Transaction(
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

      const result = await repository.save(transaction);

      expect(result).toBeInstanceOf(Transaction);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return transaction', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const transaction = new Transaction(
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
      );

      const result = await repository.update(transaction);

      expect(result).toBeInstanceOf(Transaction);
      expect(mockTypeOrmRepository.update).toHaveBeenCalled();
    });

    it('should throw error when transaction not found after update', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const transaction = new Transaction(
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
      );

      await expect(repository.update(transaction)).rejects.toThrow(
        'Transaction with id txn-123 not found after update',
      );
    });
  });
});
