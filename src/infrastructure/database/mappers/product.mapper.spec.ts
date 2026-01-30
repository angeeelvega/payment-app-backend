import { ProductMapper } from './product.mapper';
import { Product } from '@domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';

describe('ProductMapper', () => {
  const mockDate = new Date('2026-01-29T10:00:00Z');

  describe('toDomain', () => {
    it('should map schema to domain entity', () => {
      const schema = new ProductSchema();
      schema.id = 'product-1';
      schema.name = 'iPhone 15';
      schema.description = 'Latest Apple smartphone';
      schema.price = 4500000;
      schema.stock = 50;
      schema.imageUrl = 'https://example.com/iphone.jpg';
      schema.createdAt = mockDate;
      schema.updatedAt = mockDate;

      const domain = ProductMapper.toDomain(schema);

      expect(domain).toBeInstanceOf(Product);
      expect(domain.id).toBe('product-1');
      expect(domain.name).toBe('iPhone 15');
      expect(domain.description).toBe('Latest Apple smartphone');
      expect(domain.price).toBe(4500000);
      expect(domain.stock).toBe(50);
      expect(domain.imageUrl).toBe('https://example.com/iphone.jpg');
      expect(domain.createdAt).toEqual(mockDate);
      expect(domain.updatedAt).toEqual(mockDate);
    });

    it('should convert decimal price to number', () => {
      const schema = new ProductSchema();
      schema.id = 'product-1';
      schema.name = 'Test Product';
      schema.description = 'Description';
      schema.price = '1500000.50' as any;
      schema.stock = 10;

      const domain = ProductMapper.toDomain(schema);

      expect(typeof domain.price).toBe('number');
      expect(domain.price).toBe(1500000.5);
    });
  });

  describe('toSchema', () => {
    it('should map domain entity to schema', () => {
      const domain = new Product(
        'product-1',
        'iPhone 15',
        'Latest Apple smartphone',
        4500000,
        50,
        'https://example.com/iphone.jpg',
        mockDate,
        mockDate,
      );

      const schema = ProductMapper.toSchema(domain);

      expect(schema).toBeInstanceOf(ProductSchema);
      expect(schema.id).toBe('product-1');
      expect(schema.name).toBe('iPhone 15');
      expect(schema.description).toBe('Latest Apple smartphone');
      expect(schema.price).toBe(4500000);
      expect(schema.stock).toBe(50);
      expect(schema.imageUrl).toBe('https://example.com/iphone.jpg');
    });

    it('should handle undefined imageUrl', () => {
      const domain = new Product('product-1', 'Test Product', 'Description', 1000000, 10);

      const schema = ProductMapper.toSchema(domain);

      expect(schema.imageUrl).toBe('');
    });
  });
});
