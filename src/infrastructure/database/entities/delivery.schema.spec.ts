import { DeliverySchema } from './delivery.schema';

describe('DeliverySchema', () => {
  it('should create a delivery schema instance', () => {
    const estimatedDate = new Date('2026-02-01');
    const deliveredAt = new Date('2026-02-02');
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
    schema.deliveredAt = deliveredAt;
    schema.createdAt = new Date();
    schema.updatedAt = new Date();

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
    expect(schema.deliveredAt).toEqual(deliveredAt);
  });

  it('should allow nullable dates', () => {
    const schema = new DeliverySchema();

    schema.id = 'delivery-1';
    schema.transactionId = 'txn-123';
    schema.customerEmail = 'john@example.com';
    schema.customerDocumentId = '1020304050';
    schema.productId = 'product-1';
    schema.quantity = 1;
    schema.address = 'Address';
    schema.city = 'City';
    schema.status = 'PENDING';

    expect(schema.estimatedDeliveryDate).toBeUndefined();
    expect(schema.deliveredAt).toBeUndefined();
  });
});
