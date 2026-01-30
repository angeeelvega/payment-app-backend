import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import {
  CustomerRepositoryPort,
  CUSTOMER_REPOSITORY_PORT,
} from '@application/ports/out/customer-repository.port';
import { Customer } from '@domain/entities/customer.entity';

describe('CustomersController', () => {
  let controller: CustomersController;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;

  const mockCustomer = new Customer(
    'customer-123',
    'John Doe',
    'john@example.com',
    '3001234567',
    'Calle 123 #45-67',
    'Bogotá',
    new Date(),
    new Date(),
  );

  const createCustomerDto = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '3001234567',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
  };

  beforeEach(async () => {
    const mockCustomerRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CUSTOMER_REPOSITORY_PORT,
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customerRepository = module.get(CUSTOMER_REPOSITORY_PORT);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create customer successfully', async () => {
      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.save.mockResolvedValue(mockCustomer);

      const result = await controller.createCustomer(createCustomerDto);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.phone).toBe('3001234567');
      expect(result.address).toBe('Calle 123 #45-67');
      expect(result.city).toBe('Bogotá');
      expect(customerRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(customerRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequest when customer with email already exists', async () => {
      customerRepository.findByEmail.mockResolvedValue(mockCustomer);

      await expect(controller.createCustomer(createCustomerDto)).rejects.toThrow(HttpException);
      await expect(controller.createCustomer(createCustomerDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
      expect(customerRepository.save).not.toHaveBeenCalled();
    });

    it('should throw InternalServerError when repository throws error', async () => {
      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.save.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.createCustomer(createCustomerDto)).rejects.toThrow(HttpException);
      await expect(controller.createCustomer(createCustomerDto)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle non-Error exceptions', async () => {
      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.save.mockRejectedValue('Unknown error');

      await expect(controller.createCustomer(createCustomerDto)).rejects.toThrow(HttpException);
      await expect(controller.createCustomer(createCustomerDto)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should handle customer without dates', async () => {
      const customerWithoutDates = new Customer(
        'customer-123',
        'Jane Doe',
        'jane@example.com',
        '3009876543',
        'Carrera 45',
        'Medellín',
      );
      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.save.mockResolvedValue(customerWithoutDates);

      const result = await controller.createCustomer({
        ...createCustomerDto,
        email: 'jane@example.com',
      });

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should re-throw HttpException without wrapping', async () => {
      customerRepository.findByEmail.mockResolvedValue(mockCustomer);

      try {
        await controller.createCustomer(createCustomerDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect((error as HttpException).message).toBe('Customer with this email already exists');
      }
    });
  });
});
