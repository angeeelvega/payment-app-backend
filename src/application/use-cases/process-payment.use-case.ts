import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '@shared/result';
import { Transaction } from '@domain/entities/transaction.entity';
import { Delivery, DeliveryStatus } from '@domain/entities/delivery.entity';
import {
  ProcessPaymentCommand,
  ProcessPaymentPort,
} from '@application/ports/in/process-payment.port';
import {
  TransactionRepositoryPort,
  TRANSACTION_REPOSITORY_PORT,
} from '@application/ports/out/transaction-repository.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';
import {
  DeliveryRepositoryPort,
  DELIVERY_REPOSITORY_PORT,
} from '@application/ports/out/delivery-repository.port';
import {
  PaymentGatewayPort,
  PAYMENT_GATEWAY_PORT,
} from '@application/ports/out/payment-gateway.port';

@Injectable()
export class ProcessPaymentUseCase implements ProcessPaymentPort {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY_PORT)
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(DELIVERY_REPOSITORY_PORT)
    private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject(PAYMENT_GATEWAY_PORT)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<Result<Transaction>> {
    this.logger.log(`Starting payment process for transaction: ${command.transactionId}`);

    try {
      this.logger.log(`Step 1: Fetching transaction from database`);
      const transactionResult = await this.getTransaction(command.transactionId);
      if (transactionResult.isFailure) {
        this.logger.error(`Transaction fetch failed: ${transactionResult.error}`);
        return transactionResult;
      }

      const transaction = transactionResult.value;
      this.logger.log(
        `Transaction found - Number: ${transaction.transactionNumber}, Amount: ${transaction.totalAmount} COP`,
      );

      this.logger.log(`Step 2: Validating card token format`);
      if (!command.cardToken || !command.cardToken.startsWith('tok_')) {
        this.logger.error(`Invalid card token format: ${command.cardToken}`);
        transaction.error('Invalid card token format');
        await this.transactionRepository.update(transaction);
        return Result.fail('Invalid card token format. Must start with "tok_"');
      }
      this.logger.log(`Card token format valid`);

      this.logger.log(`Step 3: Calling Payment Gateway`);
      this.logger.log(
        `Payment details - Amount: ${transaction.totalAmount} COP, Installments: ${command.installments}`,
      );

      const paymentResult = await this.paymentGateway.processPayment({
        amount: transaction.totalAmount,
        currency: 'COP',
        cardToken: command.cardToken,
        cardHolder: command.cardHolder,
        installments: command.installments,
        reference: transaction.transactionNumber,
        customerEmail: command.customerEmail,
      });

      this.logger.log(
        `Payment Gateway response - Success: ${paymentResult.success}, Status: ${paymentResult.status}`,
      );

      if (!paymentResult.success) {
        this.logger.error(`Payment declined: ${paymentResult.errorMessage || 'Unknown reason'}`);
        transaction.decline(paymentResult.errorMessage || 'Payment declined');
        await this.transactionRepository.update(transaction);
        return Result.fail(paymentResult.errorMessage || 'Payment declined');
      }

      this.logger.log(`Step 4: Payment approved, updating transaction`);
      transaction.approve(
        paymentResult.transactionId || '',
        paymentResult.reference || transaction.transactionNumber,
      );
      transaction.paymentMethod = `CARD ****${command.cardToken.slice(-4)}`;
      this.logger.log(`Payment Transaction ID: ${paymentResult.transactionId}`);

      this.logger.log(`Step 5: Updating product stock`);
      const product = await this.productRepository.findById(transaction.productId);
      if (product) {
        const previousStock = product.stock;
        product.decreaseStock(transaction.quantity);
        await this.productRepository.update(product);
        this.logger.log(
          `Stock updated: ${previousStock} -> ${product.stock} (decreased by ${transaction.quantity})`,
        );
      } else {
        this.logger.warn(`Product not found for stock update: ${transaction.productId}`);
      }

      this.logger.log(`Step 6: Creating delivery`);
      await this.createDelivery(
        transaction,
        transaction.customerAddress,
        transaction.customerCity,
        transaction.customerEmail,
        transaction.customerDocumentId,
      );
      this.logger.log(
        `Delivery created for customer: ${transaction.customerEmail}, Address: ${transaction.customerAddress}, ${transaction.customerCity}`,
      );

      this.logger.log(`Step 7: Saving updated transaction`);
      const updatedTransaction = await this.transactionRepository.update(transaction);

      this.logger.log(
        `Payment process completed successfully - Final status: ${updatedTransaction.status}`,
      );

      return Result.ok(updatedTransaction);
    } catch (error) {
      this.logger.error(
        `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return Result.fail(error instanceof Error ? error.message : 'Failed to process payment');
    }
  }

  private async getTransaction(transactionId: string): Promise<Result<Transaction>> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      return Result.fail(`Transaction not found: ${transactionId}`);
    }

    if (!transaction.isPending()) {
      return Result.fail('Transaction is not in pending status');
    }

    return Result.ok(transaction);
  }

  private async createDelivery(
    transaction: Transaction,
    address: string,
    city: string,
    customerEmail: string,
    customerDocumentId: string,
  ): Promise<void> {
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);

    const deliveryId = uuidv4();
    this.logger.log(
      `Creating delivery - ID: ${deliveryId}, Estimated date: ${estimatedDeliveryDate.toISOString()}`,
    );

    const delivery = new Delivery(
      deliveryId,
      transaction.id,
      customerEmail,
      customerDocumentId,
      transaction.productId,
      transaction.quantity,
      address,
      city,
      DeliveryStatus.PENDING,
      estimatedDeliveryDate,
    );

    await this.deliveryRepository.save(delivery);
    this.logger.log(`Delivery saved successfully`);
  }
}
