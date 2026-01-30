import { Product } from './product.entity';

describe('Product Entity', () => {
  describe('constructor', () => {
    it('should create a product with all properties', () => {
      const createdAt = new Date();
      const updatedAt = new Date();
      const product = new Product(
        'product-1',
        'iPhone 15',
        'Latest Apple smartphone',
        4500000,
        50,
        'https://example.com/iphone.jpg',
        createdAt,
        updatedAt,
      );

      expect(product.id).toBe('product-1');
      expect(product.name).toBe('iPhone 15');
      expect(product.description).toBe('Latest Apple smartphone');
      expect(product.price).toBe(4500000);
      expect(product.stock).toBe(50);
      expect(product.imageUrl).toBe('https://example.com/iphone.jpg');
      expect(product.createdAt).toEqual(createdAt);
      expect(product.updatedAt).toEqual(updatedAt);
    });

    it('should create a product without optional properties', () => {
      const product = new Product('product-1', 'Test Product', 'Description', 1000000, 10);

      expect(product.id).toBe('product-1');
      expect(product.imageUrl).toBeUndefined();
      expect(product.createdAt).toBeUndefined();
      expect(product.updatedAt).toBeUndefined();
    });
  });

  describe('hasStock', () => {
    it('should return true when stock is sufficient', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 10);

      expect(product.hasStock(5)).toBe(true);
      expect(product.hasStock(10)).toBe(true);
    });

    it('should return false when stock is insufficient', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 5);

      expect(product.hasStock(6)).toBe(false);
      expect(product.hasStock(100)).toBe(false);
    });

    it('should return true for zero quantity', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 0);

      expect(product.hasStock(0)).toBe(true);
    });
  });

  describe('decreaseStock', () => {
    it('should decrease stock correctly', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 10);

      product.decreaseStock(3);

      expect(product.stock).toBe(7);
    });

    it('should decrease stock to zero', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 5);

      product.decreaseStock(5);

      expect(product.stock).toBe(0);
    });

    it('should throw error when insufficient stock', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 5);

      expect(() => product.decreaseStock(6)).toThrow('Insufficient stock');
    });
  });

  describe('increaseStock', () => {
    it('should increase stock correctly', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 10);

      product.increaseStock(5);

      expect(product.stock).toBe(15);
    });

    it('should increase stock from zero', () => {
      const product = new Product('1', 'Product', 'Desc', 1000, 0);

      product.increaseStock(10);

      expect(product.stock).toBe(10);
    });
  });
});
