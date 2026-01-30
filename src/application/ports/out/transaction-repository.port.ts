import { Transaction } from '@domain/entities/transaction.entity';

export interface TransactionRepositoryPort {
  findById(id: string): Promise<Transaction | null>;
  findByTransactionNumber(transactionNumber: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
}

export const TRANSACTION_REPOSITORY_PORT = Symbol('TRANSACTION_REPOSITORY_PORT');
