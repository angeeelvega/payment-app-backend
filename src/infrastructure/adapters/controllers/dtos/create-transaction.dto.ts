import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  Min,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    description: 'Customer first name',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  customerFirstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Perez',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  customerLastName: string;

  @ApiProperty({
    description: 'Customer address',
    example: 'Calle 123 #45-67',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  customerAddress: string;

  @ApiProperty({
    description: 'Customer document ID (cedula)',
    example: '1020304050',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9-]+$/, {
    message: 'Document ID must be alphanumeric',
  })
  customerDocumentId: string;

  @ApiPropertyOptional({
    description: 'Customer city (optional)',
    example: 'Bogota',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  customerCity?: string;

  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity to purchase',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
