import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@domain/entities/customer.entity';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { CustomerSchema } from '@infrastructure/database/entities/customer.schema';
import { CustomerMapper } from '@infrastructure/database/mappers/customer.mapper';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerSchema)
    private readonly repository: Repository<CustomerSchema>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? CustomerMapper.toDomain(schema) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const schema = await this.repository.findOne({ where: { email } });
    return schema ? CustomerMapper.toDomain(schema) : null;
  }

  async save(customer: Customer): Promise<Customer> {
    const schema = CustomerMapper.toSchema(customer);
    const saved = await this.repository.save(schema);
    return CustomerMapper.toDomain(saved);
  }

  async update(customer: Customer): Promise<Customer> {
    const schema = CustomerMapper.toSchema(customer);
    await this.repository.update(customer.id, schema);
    const updated = await this.repository.findOne({ where: { id: customer.id } });
    if (!updated) {
      throw new Error(`Customer with id ${customer.id} not found after update`);
    }
    return CustomerMapper.toDomain(updated);
  }
}
