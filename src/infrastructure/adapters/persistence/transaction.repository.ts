import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { TransactionSchema } from '@infrastructure/database/entities/transaction.schema';
import { TransactionMapper } from '@infrastructure/database/mappers/transaction.mapper';

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionSchema)
    private readonly repository: Repository<TransactionSchema>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? TransactionMapper.toDomain(schema) : null;
  }

  async findByTransactionNumber(transactionNumber: string): Promise<Transaction | null> {
    const schema = await this.repository.findOne({ where: { transactionNumber } });
    return schema ? TransactionMapper.toDomain(schema) : null;
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const schema = TransactionMapper.toSchema(transaction);
    const saved = await this.repository.save(schema);
    return TransactionMapper.toDomain(saved);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const schema = TransactionMapper.toSchema(transaction);
    await this.repository.update(transaction.id, schema);
    const updated = await this.repository.findOne({ where: { id: transaction.id } });
    if (!updated) {
      throw new Error(`Transaction with id ${transaction.id} not found after update`);
    }
    return TransactionMapper.toDomain(updated);
  }
}
