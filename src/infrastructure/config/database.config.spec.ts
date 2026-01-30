import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './database.config';

describe('Database Config', () => {
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn(),
    } as any;
  });

  describe('getDatabaseConfig', () => {
    it('should return database config with custom values', () => {
      mockConfigService.get.mockImplementation((key: string, defaultValue: any) => {
        const config: Record<string, any> = {
          DB_HOST: 'custom-host',
          DB_PORT: 5433,
          DB_USERNAME: 'custom-user',
          DB_PASSWORD: 'custom-password',
          DB_DATABASE: 'custom-db',
          DB_SYNCHRONIZE: true,
          DB_LOGGING: true,
        };
        return config[key] ?? defaultValue;
      });

      const result = getDatabaseConfig(mockConfigService) as any;

      expect(result.type).toBe('postgres');
      expect(result.host).toBe('custom-host');
      expect(result.port).toBe(5433);
      expect(result.username).toBe('custom-user');
      expect(result.password).toBe('custom-password');
      expect(result.database).toBe('custom-db');
      expect(result.synchronize).toBe(true);
      expect(result.logging).toBe(true);
      expect(result.entities).toHaveLength(4);
    });

    it('should return database config with default values', () => {
      mockConfigService.get.mockImplementation((key: string, defaultValue: any) => defaultValue);

      const result = getDatabaseConfig(mockConfigService) as any;

      expect(result.type).toBe('postgres');
      expect(result.host).toBe('localhost');
      expect(result.port).toBe(5432);
      expect(result.username).toBe('postgres');
      expect(result.password).toBe('postgres');
      expect(result.database).toBe('payment_app');
      expect(result.synchronize).toBe(false);
      expect(result.logging).toBe(false);
    });

    it('should include all entity schemas', () => {
      mockConfigService.get.mockImplementation((key: string, defaultValue: any) => defaultValue);

      const result = getDatabaseConfig(mockConfigService) as any;

      expect(result.entities).toBeDefined();
      expect(Array.isArray(result.entities)).toBe(true);
      expect(result.entities).toHaveLength(4);
    });
  });
});
