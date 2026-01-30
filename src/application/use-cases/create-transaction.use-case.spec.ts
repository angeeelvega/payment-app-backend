import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '../ports/out/product-repository.port';
import {
  TransactionRepositoryPort,
  TRANSACTION_REPOSITORY_PORT,
} from '../ports/out/transaction-repository.port';
import { Product } from '@domain/entities/product.entity';
import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let productRepository: jest.Mocked<ProductRepositoryPort>;
  let transactionRepository: jest.Mocked<TransactionRepositoryPort>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockTransactionRepository = {
      findById: jest.fn(),
      findByTransactionNumber: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: PRODUCT_REPOSITORY_PORT,
          useValue: mockProductRepository,
        },
        {
          provide: TRANSACTION_REPOSITORY_PORT,
          useValue: mockTransactionRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    productRepository = module.get(PRODUCT_REPOSITORY_PORT);
    transactionRepository = module.get(TRANSACTION_REPOSITORY_PORT);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create transaction successfully', async () => {
      const mockProduct = new Product('product-1', 'Product 1', 'Description', 100000, 10);
      const mockTransaction = new Transaction(
        'transaction-1',
        'TRX-123',
        'john@example.com',
        'John',
        'Doe',
        'Address',
        '1020304050',
        'Bogota',
        'product-1',
        2,
        200000,
        1000,
        5000,
        206000,
        TransactionStatus.PENDING,
      );

      productRepository.findById.mockResolvedValue(mockProduct);
      transactionRepository.save.mockResolvedValue(mockTransaction);
      configService.get.mockImplementation((key: string, defaultValue: any) => {
        if (key === 'BASE_FEE') return 1000;
        if (key === 'DELIVERY_FEE') return 5000;
        return defaultValue;
      });

      const result = await useCase.execute({
        customerEmail: 'john@example.com',
        customerFirstName: 'John',
        customerLastName: 'Doe',
        customerAddress: 'Address',
        customerDocumentId: '1020304050',
        customerCity: 'Bogota',
        productId: 'product-1',
        quantity: 2,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.status).toBe(TransactionStatus.PENDING);
      expect(productRepository.findById).toHaveBeenCalledWith('product-1');
    });

    it('should fail when product not found', async () => {
      productRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute({
        customerEmail: 'john@example.com',
        customerFirstName: 'John',
        customerLastName: 'Doe',
        customerAddress: 'Address',
        customerDocumentId: '1020304050',
        productId: 'invalid-product',
        quantity: 2,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Product not found');
    });

    it('should fail when insufficient stock', async () => {
      const mockProduct = new Product('product-1', 'Product 1', 'Description', 100000, 5);

      productRepository.findById.mockResolvedValue(mockProduct);

      const result = await useCase.execute({
        customerEmail: 'john@example.com',
        customerFirstName: 'John',
        customerLastName: 'Doe',
        customerAddress: 'Address',
        customerDocumentId: '1020304050',
        productId: 'product-1',
        quantity: 10,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Insufficient stock');
    });
  });
});
