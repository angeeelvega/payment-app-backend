import { Test, TestingModule } from '@nestjs/testing';
import { SecureLoggerService } from './secure-logger.service';

describe('SecureLoggerService', () => {
  let service: SecureLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecureLoggerService],
    }).compile();

    service = module.get<SecureLoggerService>(SecureLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logInfo', () => {
    it('should log info without data', () => {
      expect(() => service.logInfo('Test message')).not.toThrow();
    });

    it('should log info with sanitized data', () => {
      const data = { name: 'John', cardNumber: '4242424242424242' };
      expect(() => service.logInfo('Test message', data)).not.toThrow();
    });
  });

  describe('logError', () => {
    it('should log error without data', () => {
      expect(() => service.logError('Error message', new Error('Test error'))).not.toThrow();
    });

    it('should log error with sanitized data', () => {
      const data = { cvv: '123', password: 'secret' };
      expect(() => service.logError('Error message', new Error('Test'), data)).not.toThrow();
    });
  });

  describe('logWarn', () => {
    it('should log warning without data', () => {
      expect(() => service.logWarn('Warning message')).not.toThrow();
    });

    it('should log warning with sanitized data', () => {
      const data = { apikey: 'secret-key' };
      expect(() => service.logWarn('Warning message', data)).not.toThrow();
    });
  });

  describe('logAudit', () => {
    it('should log audit with sanitized data', () => {
      const details = { action: 'payment', amount: 100000 };
      expect(() => service.logAudit('PAYMENT', 'user-123', details)).not.toThrow();
    });
  });

  describe('sanitization', () => {
    it('should redact sensitive fields', () => {
      const data = {
        name: 'John',
        cardnumber: '4242424242424242',
        cvv: '123',
        password: 'secret123',
      };

      // Access private method through any type for testing
      const sanitized = (service as any).sanitize(data);

      expect(sanitized.name).toBe('John');
      expect(sanitized.cardnumber).toBe('***REDACTED***');
      expect(sanitized.cvv).toBe('***REDACTED***');
      expect(sanitized.password).toBe('***REDACTED***');
    });

    it('should mask tokens partially', () => {
      const data = {
        token: 'tok_test_1234567890abcdef',
        reference: 'ref_abc123def456',
      };

      const sanitized = (service as any).sanitize(data);

      expect(sanitized.token).not.toBe(data.token);
      expect(sanitized.token).toContain('*');
      expect(sanitized.reference).toContain('*');
    });

    it('should handle nested objects', () => {
      const data = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
            apikey: 'key123',
          },
        },
      };

      const sanitized = (service as any).sanitize(data);

      expect(sanitized.user.name).toBe('John');
      expect(sanitized.user.credentials.password).toBe('***REDACTED***');
      expect(sanitized.user.credentials.apikey).toBe('***REDACTED***');
    });

    it('should handle arrays', () => {
      const data = ['test', { password: 'secret' }];

      const sanitized = (service as any).sanitize(data);

      expect(sanitized[0]).toBe('test');
      expect(sanitized[1].password).toBe('***REDACTED***');
    });

    it('should handle null and undefined', () => {
      expect((service as any).sanitize(null)).toBeNull();
      expect((service as any).sanitize(undefined)).toBeUndefined();
    });

    it('should mask credit card numbers in strings', () => {
      const data = 'Payment with card 4242424242424242 processed';

      const sanitized = (service as any).sanitize(data);

      expect(sanitized).toContain('4242');
      expect(sanitized).not.toBe(data);
      expect(sanitized).toContain('*');
    });

    it('should handle short tokens', () => {
      const shortToken = '12345';
      const result = (service as any).maskToken(shortToken);
      expect(result).toBe('***');
    });

    it('should handle empty token', () => {
      const result = (service as any).maskToken('');
      expect(result).toBe('***');
    });

    it('should handle null token', () => {
      const result = (service as any).maskToken(null);
      expect(result).toBe('***');
    });
  });
});
