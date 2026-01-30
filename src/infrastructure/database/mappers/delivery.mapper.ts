import { Delivery, DeliveryStatus } from '@domain/entities/delivery.entity';
import { DeliverySchema } from '../entities/delivery.schema';

export class DeliveryMapper {
  static toDomain(schema: DeliverySchema): Delivery {
    return new Delivery(
      schema.id,
      schema.transactionId,
      schema.customerEmail || '',
      schema.customerDocumentId || '',
      schema.productId,
      schema.quantity,
      schema.address,
      schema.city,
      schema.status as DeliveryStatus,
      schema.estimatedDeliveryDate,
      schema.deliveredAt,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  static toSchema(domain: Delivery): DeliverySchema {
    const schema = new DeliverySchema();
    schema.id = domain.id;
    schema.transactionId = domain.transactionId;
    schema.customerEmail = domain.customerEmail;
    schema.customerDocumentId = domain.customerDocumentId;
    schema.productId = domain.productId;
    schema.quantity = domain.quantity;
    schema.address = domain.address;
    schema.city = domain.city;
    schema.status = domain.status;
    schema.estimatedDeliveryDate = domain.estimatedDeliveryDate || new Date();
    schema.deliveredAt = domain.deliveredAt! || null;
    return schema;
  }
}
