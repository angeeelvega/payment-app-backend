import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, Length, IsInt, Min, Max } from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty({
    description: 'Credit card number (13-19 digits)',
    example: '4242424242424242',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{13,19}$/, { message: 'Invalid card number format' })
  cardNumber: string;

  @ApiProperty({
    description: 'Card holder name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @ApiProperty({
    description: 'Expiration month (MM)',
    example: '12',
  })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Invalid expiration month' })
  expirationMonth: string;

  @ApiProperty({
    description: 'Expiration year (YY or YYYY)',
    example: '25',
  })
  @IsString()
  @Matches(/^\d{2,4}$/, { message: 'Invalid expiration year' })
  expirationYear: string;

  @ApiProperty({
    description: 'Card CVV (3-4 digits)',
    example: '123',
  })
  @IsString()
  @Length(3, 4)
  @Matches(/^\d{3,4}$/, { message: 'Invalid CVV format' })
  cvv: string;

  @ApiProperty({
    description: 'Number of installments',
    example: 1,
    minimum: 1,
    maximum: 36,
  })
  @IsInt()
  @Min(1)
  @Max(36)
  installments: number;
}
