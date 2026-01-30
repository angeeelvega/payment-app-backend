import { AppDataSource } from './data-source';

describe('AppDataSource', () => {
  it('should be defined', () => {
    expect(AppDataSource).toBeDefined();
  });

  it('should have postgres type', () => {
    expect(AppDataSource.options.type).toBe('postgres');
  });

  it('should have entities configured', () => {
    expect(AppDataSource.options.entities).toBeDefined();
    expect(Array.isArray(AppDataSource.options.entities)).toBe(true);
    expect(AppDataSource.options.entities).toHaveLength(4);
  });

  it('should have migrations path configured', () => {
    expect(AppDataSource.options.migrations).toBeDefined();
  });

  it('should have default database name', () => {
    const database = AppDataSource.options.database;
    expect(database).toBeDefined();
  });

  it('should have synchronize option', () => {
    expect(AppDataSource.options.synchronize).toBeDefined();
  });

  it('should have logging option', () => {
    expect(AppDataSource.options.logging).toBeDefined();
  });
});
