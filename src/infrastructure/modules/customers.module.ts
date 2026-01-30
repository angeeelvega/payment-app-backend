import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerSchema } from '../database/entities/customer.schema';
import { CustomersController } from '../adapters/controllers/customers.controller';
import { CustomerRepository } from '../adapters/persistence/customer.repository';
import { CUSTOMER_REPOSITORY_PORT } from '@application/ports/out/customer-repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerSchema])],
  controllers: [CustomersController],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY_PORT,
      useClass: CustomerRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY_PORT],
})
export class CustomersModule {}
