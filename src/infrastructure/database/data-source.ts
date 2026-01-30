import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ProductSchema } from './entities/product.schema';
import { CustomerSchema } from './entities/customer.schema';
import { TransactionSchema } from './entities/transaction.schema';
import { DeliverySchema } from './entities/delivery.schema';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'payment_app',
  entities: [ProductSchema, CustomerSchema, TransactionSchema, DeliverySchema],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
});
