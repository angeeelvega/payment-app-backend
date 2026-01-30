import { Result } from '@shared/result';
import { Transaction } from '@domain/entities/transaction.entity';

export interface GetTransactionPort {
  execute(transactionId: string): Promise<Result<Transaction>>;
}

export const GET_TRANSACTION_PORT = Symbol('GET_TRANSACTION_PORT');
