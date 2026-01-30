import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';
import { TransactionSchema } from '../entities/transaction.schema';

export class TransactionMapper {
  static toDomain(schema: TransactionSchema): Transaction {
    return new Transaction(
      schema.id,
      schema.transactionNumber,
      schema.customerEmail || '',
      schema.customerFirstName || '',
      schema.customerLastName || '',
      schema.customerAddress || '',
      schema.customerDocumentId || '',
      schema.customerCity || 'N/A',
      schema.productId,
      schema.quantity,
      Number(schema.productAmount),
      Number(schema.baseFee),
      Number(schema.deliveryFee),
      Number(schema.totalAmount),
      schema.status as TransactionStatus,
      schema.paymentTransactionId,
      schema.paymentReference,
      schema.paymentMethod,
      schema.statusMessage,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  static toSchema(domain: Transaction): TransactionSchema {
    const schema = new TransactionSchema();
    schema.id = domain.id;
    schema.transactionNumber = domain.transactionNumber;
    schema.customerEmail = domain.customerEmail;
    schema.customerFirstName = domain.customerFirstName;
    schema.customerLastName = domain.customerLastName;
    schema.customerAddress = domain.customerAddress;
    schema.customerDocumentId = domain.customerDocumentId;
    schema.customerCity = domain.customerCity;
    schema.productId = domain.productId;
    schema.quantity = domain.quantity;
    schema.productAmount = Number(domain.productAmount);
    schema.baseFee = Number(domain.baseFee);
    schema.deliveryFee = Number(domain.deliveryFee);
    schema.totalAmount = Number(domain.totalAmount);
    schema.status = domain.status;
    schema.paymentTransactionId = domain.paymentTransactionId || '';
    schema.paymentReference = domain.paymentReference || '';
    schema.paymentMethod = domain.paymentMethod || '';
    schema.statusMessage = domain.statusMessage || '';
    return schema;
  }
}
