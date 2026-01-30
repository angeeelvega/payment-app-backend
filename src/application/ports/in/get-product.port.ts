import { Result } from '@shared/result';
import { Product } from '@domain/entities/product.entity';

export interface GetProductPort {
  execute(productId: string): Promise<Result<Product>>;
}

export const GET_PRODUCT_PORT = Symbol('GET_PRODUCT_PORT');
