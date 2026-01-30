import { Delivery } from '@domain/entities/delivery.entity';

export interface DeliveryRepositoryPort {
  findById(id: string): Promise<Delivery | null>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
  save(delivery: Delivery): Promise<Delivery>;
  update(delivery: Delivery): Promise<Delivery>;
}

export const DELIVERY_REPOSITORY_PORT = Symbol('DELIVERY_REPOSITORY_PORT');
