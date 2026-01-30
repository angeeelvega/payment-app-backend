import { Test, TestingModule } from '@nestjs/testing';
import { GetProductUseCase } from './get-product.use-case';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';
import { Product } from '@domain/entities/product.entity';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let productRepository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(async () => {
    const mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductUseCase,
        {
          provide: PRODUCT_REPOSITORY_PORT,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductUseCase>(GetProductUseCase);
    productRepository = module.get(PRODUCT_REPOSITORY_PORT);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return product when found', async () => {
      const product = new Product('product-1', 'iPhone 15', 'Latest iPhone', 100000, 10);
      productRepository.findById.mockResolvedValue(product);

      const result = await useCase.execute('product-1');

      expect(result.isSuccess).toBe(true);
      expect(result.value).toEqual(product);
      expect(productRepository.findById).toHaveBeenCalledWith('product-1');
    });

    it('should return failure when product not found', async () => {
      productRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute('missing-product');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Product not found: missing-product');
    });

    it('should return failure when repository throws error', async () => {
      productRepository.findById.mockRejectedValue(new Error('Database connection failed'));

      const result = await useCase.execute('product-1');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Database connection failed');
    });

    it('should handle non-Error exceptions', async () => {
      productRepository.findById.mockRejectedValue('Unknown error');

      const result = await useCase.execute('product-1');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Failed to fetch product');
    });
  });
});
