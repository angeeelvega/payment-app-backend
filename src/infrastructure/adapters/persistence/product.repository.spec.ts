import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { ProductSchema } from '@infrastructure/database/entities/product.schema';
import { Product } from '@domain/entities/product.entity';

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<ProductSchema>>;

  const mockSchema: ProductSchema = {
    id: 'product-1',
    name: 'iPhone 15',
    description: 'Latest iPhone',
    price: 4500000,
    stock: 50,
    imageUrl: 'https://example.com/iphone.jpg',
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
        ProductRepository,
        {
          provide: getRepositoryToken(ProductSchema),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(ProductSchema));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockSchemas = [mockSchema, { ...mockSchema, id: 'product-2', name: 'MacBook Pro' }];
      mockTypeOrmRepository.find.mockResolvedValue(mockSchemas);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[1]).toBeInstanceOf(Product);
      expect(mockTypeOrmRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products', async () => {
      mockTypeOrmRepository.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findById('product-1');

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toBe('product-1');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'product-1' } });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save and return product', async () => {
      mockTypeOrmRepository.save.mockResolvedValue(mockSchema);

      const product = new Product('product-1', 'iPhone 15', 'Latest iPhone', 4500000, 50);

      const result = await repository.save(product);

      expect(result).toBeInstanceOf(Product);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const product = new Product('product-1', 'iPhone 15', 'Latest iPhone', 4500000, 45);

      const result = await repository.update(product);

      expect(result).toBeInstanceOf(Product);
      expect(mockTypeOrmRepository.update).toHaveBeenCalled();
    });

    it('should throw error when product not found after update', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const product = new Product('product-1', 'iPhone 15', 'Latest iPhone', 4500000, 45);

      await expect(repository.update(product)).rejects.toThrow(
        'Product with id product-1 not found after update',
      );
    });
  });
});
