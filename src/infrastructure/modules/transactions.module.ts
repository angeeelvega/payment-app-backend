import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TransactionSchema } from '../database/entities/transaction.schema';
import { DeliverySchema } from '../database/entities/delivery.schema';
import { TransactionsController } from '../adapters/controllers/transactions.controller';
import { TransactionRepository } from '../adapters/persistence/transaction.repository';
import { DeliveryRepository } from '../adapters/persistence/delivery.repository';
import { PaymentGatewayAdapter } from '../adapters/http/payment-gateway.adapter';
import { CreateTransactionUseCase } from '@application/use-cases/create-transaction.use-case';
import { ProcessPaymentUseCase } from '@application/use-cases/process-payment.use-case';
import { GetTransactionUseCase } from '@application/use-cases/get-transaction.use-case';
import { TRANSACTION_REPOSITORY_PORT } from '@application/ports/out/transaction-repository.port';
import { DELIVERY_REPOSITORY_PORT } from '@application/ports/out/delivery-repository.port';
import { PAYMENT_GATEWAY_PORT } from '@application/ports/out/payment-gateway.port';
import { CREATE_TRANSACTION_PORT } from '@application/ports/in/create-transaction.port';
import { PROCESS_PAYMENT_PORT } from '@application/ports/in/process-payment.port';
import { GET_TRANSACTION_PORT } from '@application/ports/in/get-transaction.port';
import { ProductsModule } from './products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionSchema, DeliverySchema]),
    ConfigModule,
    ProductsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY_PORT,
      useClass: TransactionRepository,
    },
    {
      provide: DELIVERY_REPOSITORY_PORT,
      useClass: DeliveryRepository,
    },
    {
      provide: PAYMENT_GATEWAY_PORT,
      useClass: PaymentGatewayAdapter,
    },
    {
      provide: CREATE_TRANSACTION_PORT,
      useClass: CreateTransactionUseCase,
    },
    {
      provide: PROCESS_PAYMENT_PORT,
      useClass: ProcessPaymentUseCase,
    },
    {
      provide: GET_TRANSACTION_PORT,
      useClass: GetTransactionUseCase,
    },
  ],
})
export class TransactionsModule {}
