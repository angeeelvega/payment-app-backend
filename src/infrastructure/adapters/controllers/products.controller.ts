import { Controller, Get, HttpException, HttpStatus, Inject, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetProductsPort, GET_PRODUCTS_PORT } from '@application/ports/in/get-products.port';
import { GetProductPort, GET_PRODUCT_PORT } from '@application/ports/in/get-product.port';
import {
  GetProductQuotePort,
  GET_PRODUCT_QUOTE_PORT,
} from '@application/ports/in/get-product-quote.port';
import { ProductResponseDto, ErrorResponseDto, ProductQuoteResponseDto } from './dtos/response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(GET_PRODUCTS_PORT)
    private readonly getProductsUseCase: GetProductsPort,
    @Inject(GET_PRODUCT_PORT)
    private readonly getProductUseCase: GetProductPort,
    @Inject(GET_PRODUCT_QUOTE_PORT)
    private readonly getProductQuoteUseCase: GetProductQuotePort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async getProducts(): Promise<ProductResponseDto[]> {
    const result = await this.getProductsUseCase.execute();

    if (result.isFailure) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.value.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  async getProduct(@Param('id') productId: string): Promise<ProductResponseDto> {
    const result = await this.getProductUseCase.execute(productId);

    if (result.isFailure) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    const product = result.value;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date(),
    };
  }

  @Get(':id/quote')
  @ApiOperation({ summary: 'Get product quote with fees' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiQuery({
    name: 'quantity',
    required: false,
    description: 'Quantity to purchase',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Product quote retrieved successfully',
    type: ProductQuoteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  async getProductQuote(
    @Param('id') productId: string,
    @Query('quantity') quantityQuery?: string,
  ): Promise<ProductQuoteResponseDto> {
    const quantity = quantityQuery ? Number(quantityQuery) : 1;
    if (Number.isNaN(quantity) || quantity < 1) {
      throw new HttpException('Quantity must be a positive integer', HttpStatus.BAD_REQUEST);
    }

    const result = await this.getProductQuoteUseCase.execute({ productId, quantity });

    if (result.isFailure) {
      const statusCode = result.error.includes('not found')
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;
      throw new HttpException(result.error, statusCode);
    }

    return result.value;
  }
}
