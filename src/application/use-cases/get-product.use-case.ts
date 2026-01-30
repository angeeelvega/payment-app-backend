import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@shared/result';
import { Product } from '@domain/entities/product.entity';
import { GetProductPort } from '@application/ports/in/get-product.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';

@Injectable()
export class GetProductUseCase implements GetProductPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(productId: string): Promise<Result<Product>> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        return Result.fail(`Product not found: ${productId}`);
      }
      return Result.ok(product);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to fetch product');
    }
  }
}
