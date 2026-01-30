import { Result } from '@shared/result';

export interface GetProductQuoteCommand {
  productId: string;
  quantity: number;
}

export interface ProductQuote {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
}

export interface GetProductQuotePort {
  execute(command: GetProductQuoteCommand): Promise<Result<ProductQuote>>;
}

export const GET_PRODUCT_QUOTE_PORT = Symbol('GET_PRODUCT_QUOTE_PORT');
