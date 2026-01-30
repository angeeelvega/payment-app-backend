import { Product } from '@domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';

export class ProductMapper {
  static toDomain(schema: ProductSchema): Product {
    return new Product(
      schema.id,
      schema.name,
      schema.description,
      Number(schema.price),
      schema.stock,
      schema.imageUrl,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  static toSchema(domain: Product): ProductSchema {
    const schema = new ProductSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.description = domain.description;
    schema.price = domain.price;
    schema.stock = domain.stock;
    schema.imageUrl = domain.imageUrl || '';
    return schema;
  }
}
