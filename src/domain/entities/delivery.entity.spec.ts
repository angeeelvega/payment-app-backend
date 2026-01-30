import { Delivery, DeliveryStatus } from './delivery.entity';

describe('Delivery Entity', () => {
  const createDelivery = (status: DeliveryStatus = DeliveryStatus.PENDING) =>
    new Delivery(
      'delivery-1',
      'txn-123',
      'john@example.com',
      '1020304050',
      'product-1',
      2,
      'Calle 123 #45-67',
      'Bogotá',
      status,
      new Date('2026-02-01T10:00:00Z'),
    );

  describe('constructor', () => {
    it('should create a delivery with all properties', () => {
      const estimatedDate = new Date('2026-02-01T10:00:00Z');
      const deliveredAt = new Date('2026-02-02T15:00:00Z');
      const createdAt = new Date('2026-01-29T10:00:00Z');
      const updatedAt = new Date('2026-01-29T10:00:00Z');

      const delivery = new Delivery(
        'delivery-1',
        'txn-123',
        'john@example.com',
        '1020304050',
        'product-1',
        2,
        'Calle 123 #45-67',
        'Bogotá',
        DeliveryStatus.DELIVERED,
        estimatedDate,
        deliveredAt,
        createdAt,
        updatedAt,
      );

      expect(delivery.id).toBe('delivery-1');
      expect(delivery.transactionId).toBe('txn-123');
      expect(delivery.customerEmail).toBe('john@example.com');
      expect(delivery.customerDocumentId).toBe('1020304050');
      expect(delivery.productId).toBe('product-1');
      expect(delivery.quantity).toBe(2);
      expect(delivery.address).toBe('Calle 123 #45-67');
      expect(delivery.city).toBe('Bogotá');
      expect(delivery.status).toBe(DeliveryStatus.DELIVERED);
      expect(delivery.estimatedDeliveryDate).toEqual(estimatedDate);
      expect(delivery.deliveredAt).toEqual(deliveredAt);
    });

    it('should create a delivery without optional properties', () => {
      const delivery = new Delivery(
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

      expect(delivery.estimatedDeliveryDate).toBeUndefined();
      expect(delivery.deliveredAt).toBeUndefined();
      expect(delivery.createdAt).toBeUndefined();
      expect(delivery.updatedAt).toBeUndefined();
    });
  });

  describe('markAsInTransit', () => {
    it('should change status to IN_TRANSIT', () => {
      const delivery = createDelivery(DeliveryStatus.PENDING);

      delivery.markAsInTransit();

      expect(delivery.status).toBe(DeliveryStatus.IN_TRANSIT);
    });
  });

  describe('markAsDelivered', () => {
    it('should change status to DELIVERED and set deliveredAt', () => {
      const delivery = createDelivery(DeliveryStatus.IN_TRANSIT);
      const beforeDelivered = new Date();

      delivery.markAsDelivered();

      expect(delivery.status).toBe(DeliveryStatus.DELIVERED);
      expect(delivery.deliveredAt).toBeDefined();
      expect(delivery.deliveredAt!.getTime()).toBeGreaterThanOrEqual(beforeDelivered.getTime());
    });
  });

  describe('cancel', () => {
    it('should change status to CANCELLED', () => {
      const delivery = createDelivery(DeliveryStatus.PENDING);

      delivery.cancel();

      expect(delivery.status).toBe(DeliveryStatus.CANCELLED);
    });

    it('should cancel in transit delivery', () => {
      const delivery = createDelivery(DeliveryStatus.IN_TRANSIT);

      delivery.cancel();

      expect(delivery.status).toBe(DeliveryStatus.CANCELLED);
    });
  });

  describe('DeliveryStatus enum', () => {
    it('should have correct status values', () => {
      expect(DeliveryStatus.PENDING).toBe('PENDING');
      expect(DeliveryStatus.IN_TRANSIT).toBe('IN_TRANSIT');
      expect(DeliveryStatus.DELIVERED).toBe('DELIVERED');
      expect(DeliveryStatus.CANCELLED).toBe('CANCELLED');
    });
  });
});
