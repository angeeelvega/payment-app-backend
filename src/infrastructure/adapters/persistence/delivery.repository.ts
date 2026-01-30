import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '@domain/entities/delivery.entity';
import { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';
import { DeliverySchema } from '@infrastructure/database/entities/delivery.schema';
import { DeliveryMapper } from '@infrastructure/database/mappers/delivery.mapper';

@Injectable()
export class DeliveryRepository implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliverySchema)
    private readonly repository: Repository<DeliverySchema>,
  ) {}

  async findById(id: string): Promise<Delivery | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? DeliveryMapper.toDomain(schema) : null;
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const schema = await this.repository.findOne({ where: { transactionId } });
    return schema ? DeliveryMapper.toDomain(schema) : null;
  }

  async save(delivery: Delivery): Promise<Delivery> {
    const schema = DeliveryMapper.toSchema(delivery);
    const saved = await this.repository.save(schema);
    return DeliveryMapper.toDomain(saved);
  }

  async update(delivery: Delivery): Promise<Delivery> {
    const schema = DeliveryMapper.toSchema(delivery);
    await this.repository.update(delivery.id, schema);
    const updated = await this.repository.findOne({ where: { id: delivery.id } });
    if (!updated) {
      throw new Error(`Delivery with id ${delivery.id} not found after update`);
    }
    return DeliveryMapper.toDomain(updated);
  }
}
