import { Customer } from '@domain/entities/customer.entity';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
}

export const CUSTOMER_REPOSITORY_PORT = Symbol('CUSTOMER_REPOSITORY_PORT');
