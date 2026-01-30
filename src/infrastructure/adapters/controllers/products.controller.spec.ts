import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { GetProductsPort, GET_PRODUCTS_PORT } from '@application/ports/in/get-products.port';
import { Product } from '@domain/entities/product.entity';
import { Result } from '@shared/result';

describe('ProductsController', () => {
  let controller: ProductsController;
  let getProductsUseCase: jest.Mocked<GetProductsPort>;

  const mockProducts = [
    new Product(
      'product-1',
      'iPhone 15',
      'Latest iPhone',
      4500000,
      50,
      'https://example.com/iphone.jpg',
      new Date(),
      new Date(),
    ),
    new Product(
      'product-2',
      'MacBook Pro',
      'Powerful laptop',
      8500000,
      20,
      'https://example.com/macbook.jpg',
      new Date(),
      new Date(),
    ),
  ];

  beforeEach(async () => {
    const mockGetProductsUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: GET_PRODUCTS_PORT,
          useValue: mockGetProductsUseCase,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    getProductsUseCase = module.get(GET_PRODUCTS_PORT);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return products successfully', async () => {
      getProductsUseCase.execute.mockResolvedValue(Result.ok(mockProducts));

      const result = await controller.getProducts();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('product-1');
      expect(result[0].name).toBe('iPhone 15');
      expect(result[1].id).toBe('product-2');
      expect(result[1].name).toBe('MacBook Pro');
      expect(getProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      getProductsUseCase.execute.mockResolvedValue(Result.ok([]));

      const result = await controller.getProducts();

      expect(result).toEqual([]);
    });

    it('should throw HttpException when use case fails', async () => {
      getProductsUseCase.execute.mockResolvedValue(Result.fail('Database connection failed'));

      await expect(controller.getProducts()).rejects.toThrow(HttpException);
      await expect(controller.getProducts()).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle products without imageUrl', async () => {
      const productsWithoutImage = [
        new Product('product-1', 'Test Product', 'Description', 1000000, 10),
      ];
      getProductsUseCase.execute.mockResolvedValue(Result.ok(productsWithoutImage));

      const result = await controller.getProducts();

      expect(result[0].imageUrl).toBe('');
    });

    it('should handle products without dates', async () => {
      const productsWithoutDates = [
        new Product('product-1', 'Test Product', 'Description', 1000000, 10),
      ];
      getProductsUseCase.execute.mockResolvedValue(Result.ok(productsWithoutDates));

      const result = await controller.getProducts();

      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
    });
  });
});
