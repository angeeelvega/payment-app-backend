import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Result } from '@shared/result';
import {
  GetProductQuoteCommand,
  GetProductQuotePort,
  ProductQuote,
} from '@application/ports/in/get-product-quote.port';
import {
  ProductRepositoryPort,
  PRODUCT_REPOSITORY_PORT,
} from '@application/ports/out/product-repository.port';

@Injectable()
export class GetProductQuoteUseCase implements GetProductQuotePort {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: GetProductQuoteCommand): Promise<Result<ProductQuote>> {
    try {
      const product = await this.productRepository.findById(command.productId);
      if (!product) {
        return Result.fail(`Product not found: ${command.productId}`);
      }

      if (command.quantity < 1) {
        return Result.fail('Quantity must be at least 1');
      }

      const baseFee = Number(this.configService.get<number>('BASE_FEE', 1000));
      const deliveryFee = Number(this.configService.get<number>('DELIVERY_FEE', 5000));
      const productPrice = Number(product.price);
      const productAmount = productPrice * command.quantity;
      const totalAmount = productAmount + baseFee + deliveryFee;

      return Result.ok({
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: command.quantity,
        productAmount,
        baseFee,
        deliveryFee,
        totalAmount,
      });
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to fetch quote');
    }
  }
}
