import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GetProductQuoteUseCase } from './get-product-quote.use-case';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';
import { Product } from '@domain/entities/product.entity';

describe('GetProductQuoteUseCase', () => {
  let useCase: GetProductQuoteUseCase;
  let productRepository: jest.Mocked<ProductRepositoryPort>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductQuoteUseCase,
        {
          provide: PRODUCT_REPOSITORY_PORT,
          useValue: mockProductRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    useCase = module.get<GetProductQuoteUseCase>(GetProductQuoteUseCase);
    productRepository = module.get(PRODUCT_REPOSITORY_PORT);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return quote when product exists', async () => {
      const product = new Product('product-1', 'iPhone 15', 'Latest iPhone', 100000, 10);
      productRepository.findById.mockResolvedValue(product);
      configService.get.mockImplementation((key: string, defaultValue: any) => {
        if (key === 'BASE_FEE') return 1000;
        if (key === 'DELIVERY_FEE') return 5000;
        return defaultValue;
      });

      const result = await useCase.execute({ productId: 'product-1', quantity: 2 });

      expect(result.isSuccess).toBe(true);
      expect(result.value.totalAmount).toBe(206000);
      expect(result.value.productAmount).toBe(200000);
      expect(result.value.baseFee).toBe(1000);
      expect(result.value.deliveryFee).toBe(5000);
    });

    it('should fail when product not found', async () => {
      productRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute({ productId: 'missing', quantity: 1 });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Product not found: missing');
    });

    it('should fail when quantity is invalid', async () => {
      const product = new Product('product-1', 'iPhone 15', 'Latest iPhone', 100000, 10);
      productRepository.findById.mockResolvedValue(product);

      const result = await useCase.execute({ productId: 'product-1', quantity: 0 });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Quantity must be at least 1');
    });

    it('should handle repository errors', async () => {
      productRepository.findById.mockRejectedValue(new Error('Database error'));

      const result = await useCase.execute({ productId: 'product-1', quantity: 1 });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Database error');
    });

    it('should handle non-Error exceptions', async () => {
      productRepository.findById.mockRejectedValue('Unknown error');

      const result = await useCase.execute({ productId: 'product-1', quantity: 1 });

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Failed to fetch quote');
    });
  });
});
