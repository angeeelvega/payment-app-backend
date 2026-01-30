import { Customer } from '@domain/entities/customer.entity';
import { CustomerSchema } from '../entities/customer.schema';

export class CustomerMapper {
  static toDomain(schema: CustomerSchema): Customer {
    return new Customer(
      schema.id,
      schema.name,
      schema.email,
      schema.phone,
      schema.address,
      schema.city,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  static toSchema(domain: Customer): CustomerSchema {
    const schema = new CustomerSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.email = domain.email;
    schema.phone = domain.phone;
    schema.address = domain.address;
    schema.city = domain.city;
    return schema;
  }
}
