import { DeliveryMapper } from './delivery.mapper';
import { Delivery, DeliveryStatus } from '@domain/entities/delivery.entity';
import { DeliverySchema } from '../entities/delivery.schema';

describe('DeliveryMapper', () => {
  const mockDate = new Date('2026-01-29T10:00:00Z');
  const estimatedDate = new Date('2026-02-01T10:00:00Z');

  describe('toDomain', () => {
    it('should map schema to domain entity', () => {
      const schema = new DeliverySchema();
      schema.id = 'delivery-1';
      schema.transactionId = 'txn-123';
      schema.customerEmail = 'john@example.com';
      schema.customerDocumentId = '1020304050';
      schema.productId = 'product-1';
      schema.quantity = 2;
      schema.address = 'Calle 123 #45-67';
      schema.city = 'Bogotá';
      schema.status = 'PENDING';
      schema.estimatedDeliveryDate = estimatedDate;
      schema.deliveredAt = null as any;
      schema.createdAt = mockDate;
      schema.updatedAt = mockDate;

      const domain = DeliveryMapper.toDomain(schema);

      expect(domain).toBeInstanceOf(Delivery);
      expect(domain.id).toBe('delivery-1');
      expect(domain.transactionId).toBe('txn-123');
      expect(domain.customerEmail).toBe('john@example.com');
      expect(domain.customerDocumentId).toBe('1020304050');
      expect(domain.productId).toBe('product-1');
      expect(domain.quantity).toBe(2);
      expect(domain.address).toBe('Calle 123 #45-67');
      expect(domain.city).toBe('Bogotá');
      expect(domain.status).toBe(DeliveryStatus.PENDING);
      expect(domain.estimatedDeliveryDate).toEqual(estimatedDate);
      expect(domain.createdAt).toEqual(mockDate);
      expect(domain.updatedAt).toEqual(mockDate);
    });

    it('should map delivered status correctly', () => {
      const schema = new DeliverySchema();
      schema.id = 'delivery-1';
      schema.transactionId = 'txn-123';
      schema.customerEmail = 'john@example.com';
      schema.customerDocumentId = '1020304050';
      schema.productId = 'product-1';
      schema.quantity = 1;
      schema.address = 'Address';
      schema.city = 'City';
      schema.status = 'DELIVERED';
      schema.deliveredAt = mockDate;

      const domain = DeliveryMapper.toDomain(schema);

      expect(domain.status).toBe(DeliveryStatus.DELIVERED);
      expect(domain.deliveredAt).toEqual(mockDate);
    });
  });

  describe('toSchema', () => {
    it('should map domain entity to schema', () => {
      const domain = new Delivery(
        'delivery-1',
        'txn-123',
        'john@example.com',
        '1020304050',
        'product-1',
        2,
        'Calle 123 #45-67',
        'Bogotá',
        DeliveryStatus.PENDING,
        estimatedDate,
        undefined,
        mockDate,
        mockDate,
      );

      const schema = DeliveryMapper.toSchema(domain);

      expect(schema).toBeInstanceOf(DeliverySchema);
      expect(schema.id).toBe('delivery-1');
      expect(schema.transactionId).toBe('txn-123');
      expect(schema.customerEmail).toBe('john@example.com');
      expect(schema.customerDocumentId).toBe('1020304050');
      expect(schema.productId).toBe('product-1');
      expect(schema.quantity).toBe(2);
      expect(schema.address).toBe('Calle 123 #45-67');
      expect(schema.city).toBe('Bogotá');
      expect(schema.status).toBe('PENDING');
      expect(schema.estimatedDeliveryDate).toEqual(estimatedDate);
    });

    it('should handle undefined estimatedDeliveryDate', () => {
      const domain = new Delivery(
        'delivery-1',
        'txn-123',
        'john@example.com',
        '1020304050',
        'product-1',
        1,
        'Address',
        'City',
        DeliveryStatus.PENDING,
      );

      const schema = DeliveryMapper.toSchema(domain);

      expect(schema.estimatedDeliveryDate).toBeInstanceOf(Date);
    });

    it('should handle delivered status with deliveredAt date', () => {
      const deliveredDate = new Date('2026-02-02T15:00:00Z');
      const domain = new Delivery(
        'delivery-1',
        'txn-123',
        'john@example.com',
        '1020304050',
        'product-1',
        1,
        'Address',
        'City',
        DeliveryStatus.DELIVERED,
        estimatedDate,
        deliveredDate,
      );

      const schema = DeliveryMapper.toSchema(domain);

      expect(schema.status).toBe('DELIVERED');
      expect(schema.deliveredAt).toEqual(deliveredDate);
    });
  });
});
