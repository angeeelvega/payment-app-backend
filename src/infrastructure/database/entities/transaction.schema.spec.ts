import { TransactionSchema } from './transaction.schema';

describe('TransactionSchema', () => {
  it('should create a transaction schema instance', () => {
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
    schema.status = 'PENDING';
    schema.paymentTransactionId = 'payment-123';
    schema.paymentReference = 'ref-001';
    schema.paymentMethod = 'CARD ****4242';
    schema.statusMessage = 'Pending payment';
    schema.createdAt = new Date();
    schema.updatedAt = new Date();

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
    expect(schema.status).toBe('PENDING');
    expect(schema.paymentTransactionId).toBe('payment-123');
    expect(schema.paymentReference).toBe('ref-001');
    expect(schema.paymentMethod).toBe('CARD ****4242');
    expect(schema.statusMessage).toBe('Pending payment');
  });

  it('should allow nullable optional fields', () => {
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
    schema.productAmount = 50000;
    schema.baseFee = 1000;
    schema.deliveryFee = 5000;
    schema.totalAmount = 56000;
    schema.status = 'PENDING';

    expect(schema.paymentTransactionId).toBeUndefined();
    expect(schema.paymentReference).toBeUndefined();
    expect(schema.paymentMethod).toBeUndefined();
    expect(schema.statusMessage).toBeUndefined();
  });
});
