import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNumericPrecision1738084800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update products table
    await queryRunner.query(`
      ALTER TABLE products 
      ALTER COLUMN price TYPE NUMERIC(15,2);
    `);

    // Update transactions table
    await queryRunner.query(`
      ALTER TABLE transactions 
      ALTER COLUMN "productAmount" TYPE NUMERIC(15,2),
      ALTER COLUMN "baseFee" TYPE NUMERIC(15,2),
      ALTER COLUMN "deliveryFee" TYPE NUMERIC(15,2),
      ALTER COLUMN "totalAmount" TYPE NUMERIC(15,2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert products table
    await queryRunner.query(`
      ALTER TABLE products 
      ALTER COLUMN price TYPE NUMERIC(10,2);
    `);

    // Revert transactions table
    await queryRunner.query(`
      ALTER TABLE transactions 
      ALTER COLUMN "productAmount" TYPE NUMERIC(10,2),
      ALTER COLUMN "baseFee" TYPE NUMERIC(10,2),
      ALTER COLUMN "deliveryFee" TYPE NUMERIC(10,2),
      ALTER COLUMN "totalAmount" TYPE NUMERIC(10,2);
    `);
  }
}
