import { AppDataSource } from '../data-source';
import { ProductSchema } from '../entities/product.schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const productRepository = AppDataSource.getRepository(ProductSchema);

    // Clear existing products
    await productRepository.clear();

    // Create dummy products
    const products = [
      {
        id: uuidv4(),
        name: 'Laptop HP Pavilion 15',
        description:
          'Laptop HP Pavilion 15 with Intel Core i5, 8GB RAM, 256GB SSD, 15.6" Full HD display',
        price: 2500000,
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      },
      {
        id: uuidv4(),
        name: 'iPhone 14 Pro',
        description: 'Apple iPhone 14 Pro 128GB, 6.1" Super Retina XDR display, A16 Bionic chip',
        price: 4500000,
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1592286927505-2fd0f2d0e7d1?w=500',
      },
      {
        id: uuidv4(),
        name: 'Samsung Galaxy S23',
        description: 'Samsung Galaxy S23 256GB, 6.1" Dynamic AMOLED display, Snapdragon 8 Gen 2',
        price: 3800000,
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      },
      {
        id: uuidv4(),
        name: 'Sony WH-1000XM5',
        description: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones, 30-hour battery life',
        price: 1200000,
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=500',
      },
      {
        id: uuidv4(),
        name: 'iPad Air 5th Gen',
        description: 'Apple iPad Air 5th Generation 64GB, 10.9" Liquid Retina display, M1 chip',
        price: 2800000,
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      },
      {
        id: uuidv4(),
        name: 'Apple Watch Series 8',
        description: 'Apple Watch Series 8 GPS 45mm, Always-On Retina display, Blood Oxygen sensor',
        price: 1800000,
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
      },
      {
        id: uuidv4(),
        name: 'MacBook Pro 14"',
        description: 'MacBook Pro 14" M2 Pro chip, 16GB RAM, 512GB SSD, Liquid Retina XDR display',
        price: 8500000,
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      },
      {
        id: uuidv4(),
        name: 'Nintendo Switch OLED',
        description: 'Nintendo Switch OLED Model with vibrant 7-inch OLED screen, enhanced audio',
        price: 1500000,
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500',
      },
    ];

    await productRepository.save(products);

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${products.length} products`);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
