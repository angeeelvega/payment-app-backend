import { AppDataSource } from '../data-source';
import { ProductSchema } from '../entities/product.schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const productRepository = AppDataSource.getRepository(ProductSchema);

    await productRepository.clear();

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
        imageUrl:
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-1-202209?wid=500&hei=500&fmt=jpeg&qlt=95&',
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
      {
        id: uuidv4(),
        name: 'AirPods Pro (2nd Gen)',
        description:
          'Apple AirPods Pro 2nd Generation with Active Noise Cancellation and USB-C case',
        price: 1100000,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1585386959984-a41552231693?w=500',
      },
      {
        id: uuidv4(),
        name: 'PlayStation 5',
        description: 'Sony PlayStation 5 Console with ultra-high speed SSD and 4K gaming support',
        price: 2600000,
        stock: 7,
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
      },
      {
        id: uuidv4(),
        name: 'Google Pixel 8',
        description: 'Google Pixel 8 128GB, 6.2" OLED display, Tensor G3 processor',
        price: 3200000,
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500',
      },
      {
        id: uuidv4(),
        name: 'Dell XPS 13',
        description: 'Dell XPS 13 laptop with Intel Core i7, 16GB RAM, 512GB SSD, 13.4" display',
        price: 5200000,
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500',
      },
      {
        id: uuidv4(),
        name: 'Kindle Paperwhite',
        description: 'Kindle Paperwhite 8GB with 6.8" glare-free display and adjustable warm light',
        price: 650000,
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500',
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
