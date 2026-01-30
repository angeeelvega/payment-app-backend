import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@shared/result';
import { Product } from '@domain/entities/product.entity';
import { GetProductsPort } from '@application/ports/in/get-products.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';

@Injectable()
export class GetProductsUseCase implements GetProductsPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(): Promise<Result<Product[]>> {
    try {
      const products = await this.productRepository.findAll();
      return Result.ok(products);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }
}
