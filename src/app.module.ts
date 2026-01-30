import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './infrastructure/config/database.config';
import { ProductsModule } from './infrastructure/modules/products.module';
import { CustomersModule } from './infrastructure/modules/customers.module';
import { TransactionsModule } from './infrastructure/modules/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    ProductsModule,
    CustomersModule,
    TransactionsModule,
  ],
})
export class AppModule {}
