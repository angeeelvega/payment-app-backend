import { Transaction, TransactionStatus } from './transaction.entity';

describe('Transaction Entity', () => {
  const createTransaction = (status: TransactionStatus = TransactionStatus.PENDING) =>
    new Transaction(
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
      status,
    );

  describe('constructor', () => {
    it('should create a transaction with all properties', () => {
      const createdAt = new Date();
      const updatedAt = new Date();

      const transaction = new Transaction(
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
        createdAt,
        updatedAt,
      );

      expect(transaction.id).toBe('txn-123');
      expect(transaction.transactionNumber).toBe('TXN-001');
      expect(transaction.customerEmail).toBe('john@example.com');
      expect(transaction.customerFirstName).toBe('John');
      expect(transaction.customerLastName).toBe('Doe');
      expect(transaction.customerAddress).toBe('Calle 123 #45-67');
      expect(transaction.customerDocumentId).toBe('1020304050');
      expect(transaction.customerCity).toBe('Bogota');
      expect(transaction.productId).toBe('product-1');
      expect(transaction.quantity).toBe(2);
      expect(transaction.productAmount).toBe(100000);
      expect(transaction.baseFee).toBe(5000);
      expect(transaction.deliveryFee).toBe(8000);
      expect(transaction.totalAmount).toBe(113000);
      expect(transaction.status).toBe(TransactionStatus.APPROVED);
      expect(transaction.paymentTransactionId).toBe('payment-123');
      expect(transaction.paymentReference).toBe('ref-001');
      expect(transaction.paymentMethod).toBe('CARD ****4242');
      expect(transaction.statusMessage).toBe('Payment approved');
    });

    it('should create a transaction without optional properties', () => {
      const transaction = createTransaction();

      expect(transaction.paymentTransactionId).toBeUndefined();
      expect(transaction.paymentReference).toBeUndefined();
      expect(transaction.paymentMethod).toBeUndefined();
      expect(transaction.statusMessage).toBeUndefined();
    });
  });

  describe('approve', () => {
    it('should set status to APPROVED and update payment details', () => {
      const transaction = createTransaction();

      transaction.approve('payment-123', 'ref-001');

      expect(transaction.status).toBe(TransactionStatus.APPROVED);
      expect(transaction.paymentTransactionId).toBe('payment-123');
      expect(transaction.paymentReference).toBe('ref-001');
      expect(transaction.statusMessage).toBe('Payment approved successfully');
    });
  });

  describe('decline', () => {
    it('should set status to DECLINED with reason', () => {
      const transaction = createTransaction();

      transaction.decline('Insufficient funds');

      expect(transaction.status).toBe(TransactionStatus.DECLINED);
      expect(transaction.statusMessage).toBe('Insufficient funds');
    });
  });

  describe('error', () => {
    it('should set status to ERROR with message', () => {
      const transaction = createTransaction();

      transaction.error('Payment gateway timeout');

      expect(transaction.status).toBe(TransactionStatus.ERROR);
      expect(transaction.statusMessage).toBe('Payment gateway timeout');
    });
  });

  describe('isPending', () => {
    it('should return true for pending transactions', () => {
      const transaction = createTransaction(TransactionStatus.PENDING);

      expect(transaction.isPending()).toBe(true);
    });

    it('should return false for approved transactions', () => {
      const transaction = createTransaction(TransactionStatus.APPROVED);

      expect(transaction.isPending()).toBe(false);
    });

    it('should return false for declined transactions', () => {
      const transaction = createTransaction(TransactionStatus.DECLINED);

      expect(transaction.isPending()).toBe(false);
    });

    it('should return false for error transactions', () => {
      const transaction = createTransaction(TransactionStatus.ERROR);

      expect(transaction.isPending()).toBe(false);
    });
  });

  describe('isApproved', () => {
    it('should return true for approved transactions', () => {
      const transaction = createTransaction(TransactionStatus.APPROVED);

      expect(transaction.isApproved()).toBe(true);
    });

    it('should return false for pending transactions', () => {
      const transaction = createTransaction(TransactionStatus.PENDING);

      expect(transaction.isApproved()).toBe(false);
    });

    it('should return false for declined transactions', () => {
      const transaction = createTransaction(TransactionStatus.DECLINED);

      expect(transaction.isApproved()).toBe(false);
    });
  });

  describe('TransactionStatus enum', () => {
    it('should have correct status values', () => {
      expect(TransactionStatus.PENDING).toBe('PENDING');
      expect(TransactionStatus.APPROVED).toBe('APPROVED');
      expect(TransactionStatus.DECLINED).toBe('DECLINED');
      expect(TransactionStatus.ERROR).toBe('ERROR');
    });
  });
});
