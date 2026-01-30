export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class InsufficientStockException extends DomainException {
  constructor(productName: string, requested: number, available: number) {
    super(
      `Insufficient stock for ${productName}. Requested: ${requested}, Available: ${available}`,
    );
    this.name = 'InsufficientStockException';
  }
}

export class InvalidCreditCardException extends DomainException {
  constructor(reason: string) {
    super(`Invalid credit card: ${reason}`);
    this.name = 'InvalidCreditCardException';
  }
}

export class TransactionNotFoundException extends DomainException {
  constructor(transactionId: string) {
    super(`Transaction not found: ${transactionId}`);
    this.name = 'TransactionNotFoundException';
  }
}

export class ProductNotFoundException extends DomainException {
  constructor(productId: string) {
    super(`Product not found: ${productId}`);
    this.name = 'ProductNotFoundException';
  }
}
