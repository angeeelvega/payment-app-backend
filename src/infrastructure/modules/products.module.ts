import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductSchema } from '../database/entities/product.schema';
import { ProductsController } from '../adapters/controllers/products.controller';
import { ProductRepository } from '../adapters/persistence/product.repository';
import { GetProductsUseCase } from '@application/use-cases/get-products.use-case';
import { PRODUCT_REPOSITORY_PORT } from '@application/ports/out/product-repository.port';
import { GET_PRODUCTS_PORT } from '@application/ports/in/get-products.port';
import { GetProductUseCase } from '@application/use-cases/get-product.use-case';
import { GET_PRODUCT_PORT } from '@application/ports/in/get-product.port';
import { GetProductQuoteUseCase } from '@application/use-cases/get-product-quote.use-case';
import { GET_PRODUCT_QUOTE_PORT } from '@application/ports/in/get-product-quote.port';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema]), ConfigModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: ProductRepository,
    },
    {
      provide: GET_PRODUCTS_PORT,
      useClass: GetProductsUseCase,
    },
    {
      provide: GET_PRODUCT_PORT,
      useClass: GetProductUseCase,
    },
    {
      provide: GET_PRODUCT_QUOTE_PORT,
      useClass: GetProductQuoteUseCase,
    },
  ],
  exports: [PRODUCT_REPOSITORY_PORT],
})
export class ProductsModule {}
