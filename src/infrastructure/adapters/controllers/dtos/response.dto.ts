import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class TransactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transactionNumber: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  customerFirstName: string;

  @ApiProperty()
  customerLastName: string;

  @ApiProperty()
  customerAddress: string;

  @ApiProperty()
  customerDocumentId: string;

  @ApiProperty()
  customerCity: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  productAmount: number;

  @ApiProperty()
  baseFee: number;

  @ApiProperty()
  deliveryFee: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  paymentTransactionId?: string;

  @ApiProperty({ required: false })
  paymentReference?: string;

  @ApiProperty({ required: false })
  paymentMethod?: string;

  @ApiProperty({ required: false })
  statusMessage?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ErrorResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty({ required: false })
  timestamp?: string;

  @ApiProperty({ required: false })
  path?: string;
}

export class ProductQuoteResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  productAmount: number;

  @ApiProperty()
  baseFee: number;

  @ApiProperty()
  deliveryFee: number;

  @ApiProperty()
  totalAmount: number;
}
