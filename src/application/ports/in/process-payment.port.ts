import { Result } from '@shared/result';
import { Transaction } from '@domain/entities/transaction.entity';

export interface ProcessPaymentCommand {
  transactionId: string;
  cardToken: string;
  cardHolder: string;
  installments: number;
  customerEmail: string;
}

export interface ProcessPaymentPort {
  execute(command: ProcessPaymentCommand): Promise<Result<Transaction>>;
}

export const PROCESS_PAYMENT_PORT = Symbol('PROCESS_PAYMENT_PORT');
