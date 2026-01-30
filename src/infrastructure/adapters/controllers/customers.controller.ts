import { Controller, Post, Body, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomerRepositoryPort,
  CUSTOMER_REPOSITORY_PORT,
} from '@application/ports/out/customer-repository.port';
import { Customer } from '@domain/entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerResponseDto, ErrorResponseDto } from './dtos/response.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY_PORT)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    this.logger.log(`Received request to create customer`);
    this.logger.log(
      `Customer data - Name: ${createCustomerDto.name}, Email: ${createCustomerDto.email}, City: ${createCustomerDto.city}`,
    );

    try {
      this.logger.log(`Checking if customer exists with email: ${createCustomerDto.email}`);
      const existingCustomer = await this.customerRepository.findByEmail(createCustomerDto.email);
      if (existingCustomer) {
        this.logger.warn(`Customer already exists with email: ${createCustomerDto.email}`);
        throw new HttpException('Customer with this email already exists', HttpStatus.BAD_REQUEST);
      }

      const customer = new Customer(
        uuidv4(),
        createCustomerDto.name,
        createCustomerDto.email,
        createCustomerDto.phone,
        createCustomerDto.address,
        createCustomerDto.city,
      );

      this.logger.log(`Saving new customer to database...`);
      const savedCustomer = await this.customerRepository.save(customer);

      this.logger.log(
        `Customer created successfully - ID: ${savedCustomer.id}, Email: ${savedCustomer.email}`,
      );

      return {
        id: savedCustomer.id,
        name: savedCustomer.name,
        email: savedCustomer.email,
        phone: savedCustomer.phone,
        address: savedCustomer.address,
        city: savedCustomer.city,
        createdAt: savedCustomer.createdAt || new Date(),
        updatedAt: savedCustomer.updatedAt || new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to create customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
