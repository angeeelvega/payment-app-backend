import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryRepository } from './delivery.repository';
import { DeliverySchema } from '@infrastructure/database/entities/delivery.schema';
import { Delivery, DeliveryStatus } from '@domain/entities/delivery.entity';

describe('DeliveryRepository', () => {
  let repository: DeliveryRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<DeliverySchema>>;

  const mockSchema: DeliverySchema = {
    id: 'delivery-1',
    transactionId: 'txn-123',
    customerEmail: 'john@example.com',
    customerDocumentId: '1020304050',
    productId: 'product-1',
    quantity: 2,
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    status: 'PENDING',
    estimatedDeliveryDate: new Date('2026-02-01'),
    deliveredAt: null as any,
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
        DeliveryRepository,
        {
          provide: getRepositoryToken(DeliverySchema),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<DeliveryRepository>(DeliveryRepository);
    mockTypeOrmRepository = module.get(getRepositoryToken(DeliverySchema));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return delivery when found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findById('delivery-1');

      expect(result).toBeInstanceOf(Delivery);
      expect(result?.id).toBe('delivery-1');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'delivery-1' } });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByTransactionId', () => {
    it('should return delivery when found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const result = await repository.findByTransactionId('txn-123');

      expect(result).toBeInstanceOf(Delivery);
      expect(result?.transactionId).toBe('txn-123');
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { transactionId: 'txn-123' },
      });
    });

    it('should return null when not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByTransactionId('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save and return delivery', async () => {
      mockTypeOrmRepository.save.mockResolvedValue(mockSchema);

      const delivery = new Delivery(
        'delivery-1',
        'txn-123',
        'john@example.com',
        '1020304050',
        'product-1',
        2,
        'Calle 123 #45-67',
        'Bogotá',
        DeliveryStatus.PENDING,
        new Date('2026-02-01'),
      );

      const result = await repository.save(delivery);

      expect(result).toBeInstanceOf(Delivery);
      expect(mockTypeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return delivery', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(mockSchema);

      const delivery = new Delivery(
        'delivery-1',
        'txn-123',
        'john@example.com',
        '1020304050',
        'product-1',
        2,
        'Calle 123 #45-67',
        'Bogotá',
        DeliveryStatus.IN_TRANSIT,
        new Date('2026-02-01'),
      );

      const result = await repository.update(delivery);

      expect(result).toBeInstanceOf(Delivery);
      expect(mockTypeOrmRepository.update).toHaveBeenCalled();
    });

    it('should throw error when delivery not found after update', async () => {
      mockTypeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const delivery = new Delivery(
        'delivery-1',
        'txn-123',
        'john@example.com',
        '1020304050',
        'product-1',
        2,
        'Address',
        'City',
        DeliveryStatus.DELIVERED,
      );

      await expect(repository.update(delivery)).rejects.toThrow(
        'Delivery with id delivery-1 not found after update',
      );
    });
  });
});
