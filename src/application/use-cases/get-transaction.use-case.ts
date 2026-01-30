import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@shared/result';
import { Transaction } from '@domain/entities/transaction.entity';
import { GetTransactionPort } from '@application/ports/in/get-transaction.port';
import {
  TransactionRepositoryPort,
  TRANSACTION_REPOSITORY_PORT,
} from '@application/ports/out/transaction-repository.port';

@Injectable()
export class GetTransactionUseCase implements GetTransactionPort {
  constructor(
    @Inject(TRANSACTION_REPOSITORY_PORT)
    private readonly transactionRepository: TransactionRepositoryPort,
  ) {}

  async execute(transactionId: string): Promise<Result<Transaction>> {
    try {
      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) {
        return Result.fail(`Transaction not found: ${transactionId}`);
      }
      return Result.ok(transaction);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to fetch transaction');
    }
  }
}
