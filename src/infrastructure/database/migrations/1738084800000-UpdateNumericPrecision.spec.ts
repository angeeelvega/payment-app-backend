import { UpdateNumericPrecision1738084800000 } from './1738084800000-UpdateNumericPrecision';
import { QueryRunner } from 'typeorm';

describe('UpdateNumericPrecision Migration', () => {
  let migration: UpdateNumericPrecision1738084800000;
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(() => {
    migration = new UpdateNumericPrecision1738084800000();
    mockQueryRunner = {
      query: jest.fn().mockResolvedValue(undefined),
    } as any;
  });

  describe('up', () => {
    it('should update products table price column precision', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE products'),
      );
      expect(mockQueryRunner.query).toHaveBeenCalledWith(expect.stringContaining('NUMERIC(15,2)'));
    });

    it('should update transactions table numeric columns precision', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE transactions'),
      );
      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('"productAmount" TYPE NUMERIC(15,2)'),
      );
      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('"baseFee" TYPE NUMERIC(15,2)'),
      );
      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('"deliveryFee" TYPE NUMERIC(15,2)'),
      );
      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('"totalAmount" TYPE NUMERIC(15,2)'),
      );
    });

    it('should execute exactly 2 queries', async () => {
      await migration.up(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('down', () => {
    it('should revert products table price column precision', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE products'),
      );
      expect(mockQueryRunner.query).toHaveBeenCalledWith(expect.stringContaining('NUMERIC(10,2)'));
    });

    it('should revert transactions table numeric columns precision', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE transactions'),
      );
      expect(mockQueryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('"productAmount" TYPE NUMERIC(10,2)'),
      );
    });

    it('should execute exactly 2 queries', async () => {
      await migration.down(mockQueryRunner);

      expect(mockQueryRunner.query).toHaveBeenCalledTimes(2);
    });
  });
});
