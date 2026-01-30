import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from './get-products.use-case';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '../ports/out/product-repository.port';
import { Product } from '@domain/entities/product.entity';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
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
        GetProductsUseCase,
        {
          provide: PRODUCT_REPOSITORY_PORT,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
    productRepository = module.get(PRODUCT_REPOSITORY_PORT);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return products successfully', async () => {
      const mockProducts = [
        new Product('1', 'Product 1', 'Description 1', 100, 10),
        new Product('2', 'Product 2', 'Description 2', 200, 20),
      ];

      productRepository.findAll.mockResolvedValue(mockProducts);

      const result = await useCase.execute();

      expect(result.isSuccess).toBe(true);
      expect(result.value).toEqual(mockProducts);
      expect(productRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return failure when repository throws error', async () => {
      productRepository.findAll.mockRejectedValue(new Error('Database error'));

      const result = await useCase.execute();

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Database error');
    });
  });
});
