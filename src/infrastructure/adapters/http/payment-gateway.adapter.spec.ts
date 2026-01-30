import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentGatewayAdapter } from './payment-gateway.adapter';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PaymentGatewayAdapter', () => {
  let adapter: PaymentGatewayAdapter;
  let configService: jest.Mocked<ConfigService>;
  let mockHttpClient: jest.Mocked<any>;

  const mockPaymentRequest = {
    amount: 113000,
    currency: 'COP',
    cardToken: 'tok_test_12345',
    cardHolder: 'John Doe',
    installments: 1,
    reference: 'TXN-001',
    customerEmail: 'john@example.com',
  };

  beforeEach(async () => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
    };

    mockedAxios.create.mockReturnValue(mockHttpClient as any);

    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          PAYMENT_GATEWAY_BASE_URL: 'https://api-payment-gateway.dev/v1',
          PAYMENT_GATEWAY_PUBLIC_KEY: 'pub_test_key',
          PAYMENT_GATEWAY_PRIVATE_KEY: 'prv_test_key',
          PAYMENT_GATEWAY_INTEGRITY_KEY: 'integrity_test_key',
        };
        return config[key] || '';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentGatewayAdapter,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    adapter = module.get<PaymentGatewayAdapter>(PaymentGatewayAdapter);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: {
          data: {
            presigned_acceptance: {
              acceptance_token: 'acceptance_token_123',
            },
          },
        },
      });

      mockHttpClient.post.mockResolvedValueOnce({
        data: {
          data: {
            id: 'payment-txn-123',
            reference: 'TXN-001',
            status: 'PENDING',
            status_message: 'Transaction pending',
          },
        },
      });

      mockHttpClient.get.mockResolvedValueOnce({
        data: {
          data: {
            id: 'payment-txn-123',
            reference: 'TXN-001',
            status: 'APPROVED',
            status_message: 'Transaction approved',
          },
        },
      });

      const result = await adapter.processPayment(mockPaymentRequest);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('payment-txn-123');
      expect(result.status).toBe('APPROVED');
    });

    it('should return failure when acceptance token request fails', async () => {
      mockHttpClient.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await adapter.processPayment(mockPaymentRequest);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Failed to get acceptance token');
    });

    it('should handle non-Error exceptions in acceptance token', async () => {
      mockHttpClient.get.mockRejectedValueOnce('Unknown error');

      const result = await adapter.processPayment(mockPaymentRequest);

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Failed to get acceptance token');
    });
  });

  describe('getTransactionStatus', () => {
    it('should return approved status', async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: {
          data: {
            id: 'payment-txn-123',
            reference: 'TXN-001',
            status: 'APPROVED',
            status_message: 'Transaction approved',
          },
        },
      });

      const result = await adapter.getTransactionStatus('payment-txn-123');

      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('payment-txn-123');
      expect(result.status).toBe('APPROVED');
    });

    it('should return declined status', async () => {
      mockHttpClient.get.mockResolvedValueOnce({
        data: {
          data: {
            id: 'payment-txn-123',
            reference: 'TXN-001',
            status: 'DECLINED',
            status_message: 'Insufficient funds',
          },
        },
      });

      const result = await adapter.getTransactionStatus('payment-txn-123');

      expect(result.success).toBe(false);
      expect(result.status).toBe('DECLINED');
      expect(result.statusMessage).toBe('Insufficient funds');
    });

    it('should return failure when request fails', async () => {
      mockHttpClient.get.mockRejectedValueOnce(new Error('API error'));

      const result = await adapter.getTransactionStatus('payment-txn-123');

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('API error');
    });

    it('should handle non-Error exceptions in getTransactionStatus', async () => {
      mockHttpClient.get.mockRejectedValueOnce('Unknown error');

      const result = await adapter.getTransactionStatus('payment-txn-123');

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Unknown error');
    });
  });
});
