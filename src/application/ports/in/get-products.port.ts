import { Result } from '@shared/result';
import { Product } from '@domain/entities/product.entity';

export interface GetProductsPort {
  execute(): Promise<Result<Product[]>>;
}

export const GET_PRODUCTS_PORT = Symbol('GET_PRODUCTS_PORT');
