import { ProductSchema } from './product.schema';

describe('ProductSchema', () => {
  it('should create a product schema instance', () => {
    const schema = new ProductSchema();

    schema.id = 'product-1';
    schema.name = 'iPhone 15';
    schema.description = 'Latest iPhone';
    schema.price = 4500000;
    schema.stock = 50;
    schema.imageUrl = 'https://example.com/iphone.jpg';
    schema.createdAt = new Date();
    schema.updatedAt = new Date();

    expect(schema.id).toBe('product-1');
    expect(schema.name).toBe('iPhone 15');
    expect(schema.description).toBe('Latest iPhone');
    expect(schema.price).toBe(4500000);
    expect(schema.stock).toBe(50);
    expect(schema.imageUrl).toBe('https://example.com/iphone.jpg');
    expect(schema.createdAt).toBeInstanceOf(Date);
    expect(schema.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow nullable imageUrl', () => {
    const schema = new ProductSchema();

    schema.id = 'product-1';
    schema.name = 'Test Product';
    schema.description = 'Description';
    schema.price = 1000000;
    schema.stock = 10;

    expect(schema.imageUrl).toBeUndefined();
  });
});
