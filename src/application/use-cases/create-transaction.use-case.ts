import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '@shared/result';
import { Transaction, TransactionStatus } from '@domain/entities/transaction.entity';
import { Product } from '@domain/entities/product.entity';
import {
  CreateTransactionCommand,
  CreateTransactionPort,
} from '@application/ports/in/create-transaction.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';
import {
  TransactionRepositoryPort,
  TRANSACTION_REPOSITORY_PORT,
} from '@application/ports/out/transaction-repository.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateTransactionUseCase implements CreateTransactionPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(TRANSACTION_REPOSITORY_PORT)
    private readonly transactionRepository: TransactionRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Result<Transaction>> {
    try {
      const productResult = await this.validateProductAndStock(command.productId, command.quantity);
      if (productResult.isFailure) {
        return Result.fail(productResult.error);
      }

      const product = productResult.value;

      const baseFee = Number(this.configService.get<number>('BASE_FEE', 1000));
      const deliveryFee = Number(this.configService.get<number>('DELIVERY_FEE', 5000));
      const productPrice = Number(product.price);
      const productAmount = productPrice * command.quantity;
      const totalAmount = productAmount + baseFee + deliveryFee;
      const customerCity = command.customerCity?.trim() || 'N/A';

      const transaction = new Transaction(
        uuidv4(),
        this.generateTransactionNumber(),
        command.customerEmail,
        command.customerFirstName,
        command.customerLastName,
        command.customerAddress,
        command.customerDocumentId,
        customerCity,
        command.productId,
        command.quantity,
        productAmount,
        baseFee,
        deliveryFee,
        totalAmount,
        TransactionStatus.PENDING,
      );

      const savedTransaction = await this.transactionRepository.save(transaction);
      return Result.ok(savedTransaction);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to create transaction');
    }
  }

  private async validateProductAndStock(
    productId: string,
    quantity: number,
  ): Promise<Result<Product>> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return Result.fail(`Product not found: ${productId}`);
    }

    if (!product.hasStock(quantity)) {
      return Result.fail(
        `Insufficient stock for ${product.name}. Requested: ${quantity}, Available: ${product.stock}`,
      );
    }

    return Result.ok(product);
  }

  private generateTransactionNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `TRX-${timestamp}-${random}`;
  }
}
