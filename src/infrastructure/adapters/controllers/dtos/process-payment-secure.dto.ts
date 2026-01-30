import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  Matches,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ProcessPaymentSecureDto {
  @ApiProperty({
    description: 'Token de tarjeta tokenizado por el Payment Gateway (PCI-DSS compliant)',
    example: 'tok_stagtest_5113_2f42de55E3693E27FA9f2855386fb543',
    pattern: '^tok_[a-zA-Z0-9_]+$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^tok_[a-zA-Z0-9_]+$/, {
    message: 'Invalid card token format. Must start with "tok_"',
  })
  cardToken: string;

  @ApiProperty({
    description: 'Nombre del titular de la tarjeta (no sensible)',
    example: 'John Doe',
    maxLength: 100,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Card holder name must contain only letters and spaces',
  })
  cardHolder: string;

  @ApiProperty({
    description: 'Número de cuotas',
    example: 1,
    minimum: 1,
    maximum: 36,
  })
  @IsInt()
  @Min(1, { message: 'Installments must be at least 1' })
  @Max(36, { message: 'Installments cannot exceed 36' })
  installments: number;

  @ApiProperty({
    description: 'Email del cliente para notificaciones',
    example: 'customer@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  customerEmail: string;
}
