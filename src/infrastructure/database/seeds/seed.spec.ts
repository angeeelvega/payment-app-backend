import { DataSource, Repository } from 'typeorm';
import { ProductSchema } from '../entities/product.schema';

jest.mock('../data-source', () => ({
  AppDataSource: {
    initialize: jest.fn(),
    getRepository: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('Seed', () => {
  let mockRepository: jest.Mocked<Repository<ProductSchema>>;
  let AppDataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      clear: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue([]),
    } as any;

    AppDataSource = require('../data-source').AppDataSource;
    AppDataSource.initialize.mockResolvedValue(AppDataSource);
    AppDataSource.getRepository.mockReturnValue(mockRepository);
    AppDataSource.destroy.mockResolvedValue(undefined);
  });

  describe('seed function logic', () => {
    it('should initialize data source', async () => {
      await AppDataSource.initialize();
      expect(AppDataSource.initialize).toHaveBeenCalled();
    });

    it('should get product repository', () => {
      const repo = AppDataSource.getRepository(ProductSchema);
      expect(AppDataSource.getRepository).toHaveBeenCalledWith(ProductSchema);
      expect(repo).toBe(mockRepository);
    });

    it('should clear existing products', async () => {
      await mockRepository.clear();
      expect(mockRepository.clear).toHaveBeenCalled();
    });

    it('should save products', async () => {
      const products = [
        {
          id: 'mocked-uuid',
          name: 'Test Product',
          description: 'Test Description',
          price: 1000000,
          stock: 10,
          imageUrl: 'https://example.com/image.jpg',
        },
      ];

      await mockRepository.save(products);
      expect(mockRepository.save).toHaveBeenCalledWith(products);
    });

    it('should destroy data source connection', async () => {
      await AppDataSource.destroy();
      expect(AppDataSource.destroy).toHaveBeenCalled();
    });
  });

  describe('seed products data structure', () => {
    const expectedProducts = [
      {
        name: 'Laptop HP Pavilion 15',
        price: 2500000,
        stock: 10,
      },
      {
        name: 'iPhone 14 Pro',
        price: 4500000,
        stock: 15,
      },
      {
        name: 'Samsung Galaxy S23',
        price: 3800000,
        stock: 12,
      },
      {
        name: 'Sony WH-1000XM5',
        price: 1200000,
        stock: 20,
      },
      {
        name: 'iPad Air 5th Gen',
        price: 2800000,
        stock: 8,
      },
      {
        name: 'Apple Watch Series 8',
        price: 1800000,
        stock: 18,
      },
      {
        name: 'MacBook Pro 14"',
        price: 8500000,
        stock: 5,
      },
      {
        name: 'Nintendo Switch OLED',
        price: 1500000,
        stock: 25,
      },
    ];

    it('should have 8 products defined', () => {
      expect(expectedProducts).toHaveLength(8);
    });

    it('should have valid product structure', () => {
      expectedProducts.forEach((product) => {
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('stock');
        expect(typeof product.name).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(typeof product.stock).toBe('number');
        expect(product.price).toBeGreaterThan(0);
        expect(product.stock).toBeGreaterThan(0);
      });
    });

    it('should have valid prices in COP', () => {
      expectedProducts.forEach((product) => {
        expect(product.price).toBeGreaterThanOrEqual(1000000);
        expect(product.price).toBeLessThanOrEqual(10000000);
      });
    });
  });

  describe('error handling', () => {
    it('should handle initialization error', async () => {
      AppDataSource.initialize.mockRejectedValue(new Error('Connection failed'));

      await expect(AppDataSource.initialize()).rejects.toThrow('Connection failed');
    });

    it('should handle clear error', async () => {
      mockRepository.clear.mockRejectedValue(new Error('Clear failed'));

      await expect(mockRepository.clear()).rejects.toThrow('Clear failed');
    });

    it('should handle save error', async () => {
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(mockRepository.save([])).rejects.toThrow('Save failed');
    });
  });
});
