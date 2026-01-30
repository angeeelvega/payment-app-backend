import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepository } from './customer.repository';
import { CustomerSchema } from '@infrastructure/database/entities/customer.schema';
import { Customer } from '@domain/entities/customer.entity';

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<CustomerSchema>>;

  const mockSchema: CustomerSchema = {
    id: 'customer-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '3001234567',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        {
          provide: getRepositoryToken(CustomerSchema),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<CustomerRepository>(CustomerRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(CustomerSchema));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return customer when found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findById('customer-1');

      expect(result).toBeInstanceOf(Customer);
      expect(result?.id).toBe('customer-1');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'customer-1' } });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return customer when found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findByEmail('john@example.com');

      expect(result).toBeInstanceOf(Customer);
      expect(result?.email).toBe('john@example.com');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save and return customer', async () => {
      mockTypeOrmRepository.save.mockResolvedValue(mockSchema);

      const customer = new Customer(
        'customer-1',
        'John Doe',
        'john@example.com',
        '3001234567',
        'Calle 123 #45-67',
        'Bogotá',
      );

      const result = await repository.save(customer);

      expect(result).toBeInstanceOf(Customer);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return customer', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const customer = new Customer(
        'customer-1',
        'John Doe Updated',
        'john@example.com',
        '3001234567',
        'New Address',
        'Medellín',
      );

      const result = await repository.update(customer);

      expect(result).toBeInstanceOf(Customer);
      expect(mockTypeOrmRepository.update).toHaveBeenCalled();
    });

    it('should throw error when customer not found after update', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const customer = new Customer(
        'customer-1',
        'John Doe',
        'john@example.com',
        '3001234567',
        'Address',
        'City',
      );

      await expect(repository.update(customer)).rejects.toThrow(
        'Customer with id customer-1 not found after update',
      );
    });
  });
});
