import { Test, TestingModule } from '@nestjs/testing';
import { SecurityMiddleware } from './security.middleware';
import { Request, Response, NextFunction } from 'express';

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityMiddleware],
    }).compile();

    middleware = module.get<SecurityMiddleware>(SecurityMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
      mockRequest = {
        body: {},
      };
      mockResponse = {
        setHeader: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should call next function', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should set X-Frame-Options header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    });

    it('should set X-Content-Type-Options header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    });

    it('should set X-XSS-Protection header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
    });

    it('should set Strict-Transport-Security header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
    });

    it('should set Content-Security-Policy header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Security-Policy',
        "default-src 'self'; frame-ancestors 'none'",
      );
    });

    it('should set Referrer-Policy header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Referrer-Policy',
        'strict-origin-when-cross-origin',
      );
    });

    it('should set Permissions-Policy header', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=()',
      );
    });

    it('should detect credit card numbers in request body', () => {
      const warnSpy = jest.spyOn((middleware as any).logger, 'warn');
      mockRequest.body = { cardNumber: '4242424242424242' };

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(warnSpy).toHaveBeenCalled();
    });

    it('should detect CVV in request body with context', () => {
      const warnSpy = jest.spyOn((middleware as any).logger, 'warn');
      mockRequest.body = { cvv: '123' };

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(warnSpy).toHaveBeenCalled();
    });

    it('should detect email patterns', () => {
      const warnSpy = jest.spyOn((middleware as any).logger, 'warn');
      mockRequest.body = { email: 'test@example.com' };

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(warnSpy).toHaveBeenCalled();
    });

    it('should not warn for safe data', () => {
      const warnSpy = jest.spyOn((middleware as any).logger, 'warn');
      mockRequest.body = { name: 'John Doe', quantity: 5 };

      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should set all security headers', () => {
      middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.setHeader).toHaveBeenCalledTimes(7);
    });
  });
});
