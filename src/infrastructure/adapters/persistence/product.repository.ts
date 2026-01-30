import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domain/entities/product.entity';
import { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import { ProductSchema } from '@infrastructure/database/entities/product.schema';
import { ProductMapper } from '@infrastructure/database/mappers/product.mapper';

@Injectable()
export class ProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly repository: Repository<ProductSchema>,
  ) {}

  async findAll(): Promise<Product[]> {
    const schemas = await this.repository.find({ order: { name: 'ASC' } });
    return schemas.map((schema) => ProductMapper.toDomain(schema));
  }

  async findById(id: string): Promise<Product | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? ProductMapper.toDomain(schema) : null;
  }

  async save(product: Product): Promise<Product> {
    const schema = ProductMapper.toSchema(product);
    const saved = await this.repository.save(schema);
    return ProductMapper.toDomain(saved);
  }

  async update(product: Product): Promise<Product> {
    const schema = ProductMapper.toSchema(product);
    await this.repository.update(product.id, schema);
    const updated = await this.repository.findOne({ where: { id: product.id } });
    if (!updated) {
      throw new Error(`Product with id ${product.id} not found after update`);
    }
    return ProductMapper.toDomain(updated);
  }
}
