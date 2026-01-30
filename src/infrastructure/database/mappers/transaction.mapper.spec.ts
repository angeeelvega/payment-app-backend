import { TransactionMapper } from './transaction.mapper';
import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';
import { TransactionSchema } from '../entities/transaction.schema';

describe('TransactionMapper', () => {
  const mockDate = new Date('2026-01-29T10:00:00Z');

  describe('toDomain', () => {
    it('should map schema to domain entity', () => {
      const schema = new TransactionSchema();
      schema.id = 'txn-123';
      schema.transactionNumber = 'TXN-001';
      schema.customerEmail = 'john@example.com';
      schema.customerFirstName = 'John';
      schema.customerLastName = 'Doe';
      schema.customerAddress = 'Calle 123 #45-67';
      schema.customerDocumentId = '1020304050';
      schema.customerCity = 'Bogota';
      schema.productId = 'product-1';
      schema.quantity = 2;
      schema.productAmount = 100000;
      schema.baseFee = 5000;
      schema.deliveryFee = 8000;
      schema.totalAmount = 113000;
      schema.status = 'APPROVED';
      schema.paymentTransactionId = 'payment-123';
      schema.paymentReference = 'ref-001';
      schema.paymentMethod = 'CARD ****4242';
      schema.statusMessage = 'Payment approved';
      schema.createdAt = mockDate;
      schema.updatedAt = mockDate;

      const domain = TransactionMapper.toDomain(schema);

      expect(domain).toBeInstanceOf(Transaction);
      expect(domain.id).toBe('txn-123');
      expect(domain.transactionNumber).toBe('TXN-001');
      expect(domain.customerEmail).toBe('john@example.com');
      expect(domain.customerFirstName).toBe('John');
      expect(domain.customerLastName).toBe('Doe');
      expect(domain.customerAddress).toBe('Calle 123 #45-67');
      expect(domain.customerDocumentId).toBe('1020304050');
      expect(domain.customerCity).toBe('Bogota');
      expect(domain.productId).toBe('product-1');
      expect(domain.quantity).toBe(2);
      expect(domain.productAmount).toBe(100000);
      expect(domain.baseFee).toBe(5000);
      expect(domain.deliveryFee).toBe(8000);
      expect(domain.totalAmount).toBe(113000);
      expect(domain.status).toBe(TransactionStatus.APPROVED);
      expect(domain.paymentTransactionId).toBe('payment-123');
      expect(domain.paymentReference).toBe('ref-001');
      expect(domain.paymentMethod).toBe('CARD ****4242');
      expect(domain.statusMessage).toBe('Payment approved');
      expect(domain.createdAt).toEqual(mockDate);
      expect(domain.updatedAt).toEqual(mockDate);
    });

    it('should convert decimal strings to numbers', () => {
      const schema = new TransactionSchema();
      schema.id = 'txn-123';
      schema.transactionNumber = 'TXN-001';
      schema.customerEmail = 'john@example.com';
      schema.customerFirstName = 'John';
      schema.customerLastName = 'Doe';
      schema.customerAddress = 'Calle 123 #45-67';
      schema.customerDocumentId = '1020304050';
      schema.customerCity = 'Bogota';
      schema.productId = 'product-1';
      schema.quantity = 1;
      schema.productAmount = '50000.50' as any;
      schema.baseFee = '1000.00' as any;
      schema.deliveryFee = '5000.00' as any;
      schema.totalAmount = '56000.50' as any;
      schema.status = 'PENDING';

      const domain = TransactionMapper.toDomain(schema);

      expect(typeof domain.productAmount).toBe('number');
      expect(typeof domain.baseFee).toBe('number');
      expect(typeof domain.deliveryFee).toBe('number');
      expect(typeof domain.totalAmount).toBe('number');
    });
  });

  describe('toSchema', () => {
    it('should map domain entity to schema', () => {
      const domain = new Transaction(
        'txn-123',
        'TXN-001',
        'john@example.com',
        'John',
        'Doe',
        'Calle 123 #45-67',
        '1020304050',
        'Bogota',
        'product-1',
        2,
        100000,
        5000,
        8000,
        113000,
        TransactionStatus.APPROVED,
        'payment-123',
        'ref-001',
        'CARD ****4242',
        'Payment approved',
        mockDate,
        mockDate,
      );

      const schema = TransactionMapper.toSchema(domain);

      expect(schema).toBeInstanceOf(TransactionSchema);
      expect(schema.id).toBe('txn-123');
      expect(schema.transactionNumber).toBe('TXN-001');
      expect(schema.customerEmail).toBe('john@example.com');
      expect(schema.customerFirstName).toBe('John');
      expect(schema.customerLastName).toBe('Doe');
      expect(schema.customerAddress).toBe('Calle 123 #45-67');
      expect(schema.customerDocumentId).toBe('1020304050');
      expect(schema.customerCity).toBe('Bogota');
      expect(schema.productId).toBe('product-1');
      expect(schema.quantity).toBe(2);
      expect(schema.productAmount).toBe(100000);
      expect(schema.baseFee).toBe(5000);
      expect(schema.deliveryFee).toBe(8000);
      expect(schema.totalAmount).toBe(113000);
      expect(schema.status).toBe('APPROVED');
      expect(schema.paymentTransactionId).toBe('payment-123');
      expect(schema.paymentReference).toBe('ref-001');
      expect(schema.paymentMethod).toBe('CARD ****4242');
      expect(schema.statusMessage).toBe('Payment approved');
    });

    it('should handle undefined optional fields', () => {
      const domain = new Transaction(
        'txn-123',
        'TXN-001',
        'john@example.com',
        'John',
        'Doe',
        'Calle 123 #45-67',
        '1020304050',
        'Bogota',
        'product-1',
        1,
        50000,
        1000,
        5000,
        56000,
        TransactionStatus.PENDING,
      );

      const schema = TransactionMapper.toSchema(domain);

      expect(schema.paymentTransactionId).toBe('');
      expect(schema.paymentReference).toBe('');
      expect(schema.paymentMethod).toBe('');
      expect(schema.statusMessage).toBe('');
    });
  });
});
