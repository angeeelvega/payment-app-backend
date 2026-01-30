import { Result } from '@shared/result';
import { Transaction } from '@domain/entities/transaction.entity';

export interface CreateTransactionCommand {
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerAddress: string;
  customerDocumentId: string;
  customerCity?: string;
  productId: string;
  quantity: number;
}

export interface CreateTransactionPort {
  execute(command: CreateTransactionCommand): Promise<Result<Transaction>>;
}

export const CREATE_TRANSACTION_PORT = Symbol('CREATE_TRANSACTION_PORT');
