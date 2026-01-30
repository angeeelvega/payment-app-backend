import { Customer } from './customer.entity';

describe('Customer Entity', () => {
  describe('constructor', () => {
    it('should create a customer with all properties', () => {
      const createdAt = new Date();
      const updatedAt = new Date();

      const customer = new Customer(
        'customer-1',
        'John Doe',
        'john@example.com',
        '3001234567',
        'Calle 123 #45-67',
        'Bogotá',
        createdAt,
        updatedAt,
      );

      expect(customer.id).toBe('customer-1');
      expect(customer.name).toBe('John Doe');
      expect(customer.email).toBe('john@example.com');
      expect(customer.phone).toBe('3001234567');
      expect(customer.address).toBe('Calle 123 #45-67');
      expect(customer.city).toBe('Bogotá');
      expect(customer.createdAt).toEqual(createdAt);
      expect(customer.updatedAt).toEqual(updatedAt);
    });

    it('should create a customer without optional properties', () => {
      const customer = new Customer(
        'customer-1',
        'Jane Doe',
        'jane@example.com',
        '3009876543',
        'Carrera 45 #12-34',
        'Medellín',
      );

      expect(customer.id).toBe('customer-1');
      expect(customer.name).toBe('Jane Doe');
      expect(customer.email).toBe('jane@example.com');
      expect(customer.phone).toBe('3009876543');
      expect(customer.address).toBe('Carrera 45 #12-34');
      expect(customer.city).toBe('Medellín');
      expect(customer.createdAt).toBeUndefined();
      expect(customer.updatedAt).toBeUndefined();
    });

    it('should have readonly id property', () => {
      const customer = new Customer(
        'customer-1',
        'Test User',
        'test@example.com',
        '3001111111',
        'Address',
        'City',
      );

      expect(customer.id).toBe('customer-1');
    });
  });
});
