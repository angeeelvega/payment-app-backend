import { CustomerSchema } from './customer.schema';

describe('CustomerSchema', () => {
  it('should create a customer schema instance', () => {
    const schema = new CustomerSchema();

    schema.id = 'customer-1';
    schema.name = 'John Doe';
    schema.email = 'john@example.com';
    schema.phone = '3001234567';
    schema.address = 'Calle 123 #45-67';
    schema.city = 'Bogotá';
    schema.createdAt = new Date();
    schema.updatedAt = new Date();

    expect(schema.id).toBe('customer-1');
    expect(schema.name).toBe('John Doe');
    expect(schema.email).toBe('john@example.com');
    expect(schema.phone).toBe('3001234567');
    expect(schema.address).toBe('Calle 123 #45-67');
    expect(schema.city).toBe('Bogotá');
    expect(schema.createdAt).toBeInstanceOf(Date);
    expect(schema.updatedAt).toBeInstanceOf(Date);
  });
});
