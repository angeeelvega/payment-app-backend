import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ProductSchema } from '../database/entities/product.schema';
import { CustomerSchema } from '../database/entities/customer.schema';
import { TransactionSchema } from '../database/entities/transaction.schema';
import { DeliverySchema } from '../database/entities/delivery.schema';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'payment_app'),
  entities: [ProductSchema, CustomerSchema, TransactionSchema, DeliverySchema],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
  logging: configService.get<boolean>('DB_LOGGING', false),
});
