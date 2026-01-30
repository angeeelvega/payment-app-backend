import {
  DomainException,
  InsufficientStockException,
  InvalidCreditCardException,
  TransactionNotFoundException,
  ProductNotFoundException,
} from './domain.exception';

describe('Domain Exceptions', () => {
  describe('DomainException', () => {
    it('should create a domain exception with the correct message', () => {
      const exception = new DomainException('Test error message');

      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe('Test error message');
      expect(exception.name).toBe('DomainException');
    });
  });

  describe('InsufficientStockException', () => {
    it('should create an exception with formatted message', () => {
      const exception = new InsufficientStockException('iPhone 15', 5, 2);

      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(
        'Insufficient stock for iPhone 15. Requested: 5, Available: 2',
      );
      expect(exception.name).toBe('InsufficientStockException');
    });

    it('should handle zero available stock', () => {
      const exception = new InsufficientStockException('MacBook Pro', 1, 0);

      expect(exception.message).toBe(
        'Insufficient stock for MacBook Pro. Requested: 1, Available: 0',
      );
    });
  });

  describe('InvalidCreditCardException', () => {
    it('should create an exception with reason', () => {
      const exception = new InvalidCreditCardException('expired card');

      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe('Invalid credit card: expired card');
      expect(exception.name).toBe('InvalidCreditCardException');
    });

    it('should handle different reasons', () => {
      const exception = new InvalidCreditCardException('invalid CVV');

      expect(exception.message).toBe('Invalid credit card: invalid CVV');
    });
  });

  describe('TransactionNotFoundException', () => {
    it('should create an exception with transaction id', () => {
      const transactionId = '123e4567-e89b-12d3-a456-426614174000';
      const exception = new TransactionNotFoundException(transactionId);

      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(`Transaction not found: ${transactionId}`);
      expect(exception.name).toBe('TransactionNotFoundException');
    });
  });

  describe('ProductNotFoundException', () => {
    it('should create an exception with product id', () => {
      const productId = 'prod-001';
      const exception = new ProductNotFoundException(productId);

      expect(exception).toBeInstanceOf(DomainException);
      expect(exception.message).toBe(`Product not found: ${productId}`);
      expect(exception.name).toBe('ProductNotFoundException');
    });
  });
});
