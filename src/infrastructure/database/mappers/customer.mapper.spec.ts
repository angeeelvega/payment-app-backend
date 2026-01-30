import { CustomerMapper } from './customer.mapper';
import { Customer } from '@domain/entities/customer.entity';
import { CustomerSchema } from '../entities/customer.schema';

describe('CustomerMapper', () => {
  const mockDate = new Date('2026-01-29T10:00:00Z');

  describe('toDomain', () => {
    it('should map schema to domain entity', () => {
      const schema = new CustomerSchema();
      schema.id = 'customer-1';
      schema.name = 'John Doe';
      schema.email = 'john@example.com';
      schema.phone = '3001234567';
      schema.address = 'Calle 123 #45-67';
      schema.city = 'Bogotá';
      schema.createdAt = mockDate;
      schema.updatedAt = mockDate;

      const domain = CustomerMapper.toDomain(schema);

      expect(domain).toBeInstanceOf(Customer);
      expect(domain.id).toBe('customer-1');
      expect(domain.name).toBe('John Doe');
      expect(domain.email).toBe('john@example.com');
      expect(domain.phone).toBe('3001234567');
      expect(domain.address).toBe('Calle 123 #45-67');
      expect(domain.city).toBe('Bogotá');
      expect(domain.createdAt).toEqual(mockDate);
      expect(domain.updatedAt).toEqual(mockDate);
    });
  });

  describe('toSchema', () => {
    it('should map domain entity to schema', () => {
      const domain = new Customer(
        'customer-1',
        'John Doe',
        'john@example.com',
        '3001234567',
        'Calle 123 #45-67',
        'Bogotá',
        mockDate,
        mockDate,
      );

      const schema = CustomerMapper.toSchema(domain);

      expect(schema).toBeInstanceOf(CustomerSchema);
      expect(schema.id).toBe('customer-1');
      expect(schema.name).toBe('John Doe');
      expect(schema.email).toBe('john@example.com');
      expect(schema.phone).toBe('3001234567');
      expect(schema.address).toBe('Calle 123 #45-67');
      expect(schema.city).toBe('Bogotá');
    });
  });
});
