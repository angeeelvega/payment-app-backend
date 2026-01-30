import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.setSecurityHeaders(res);

    this.detectSensitiveData(req);

    next();
  }

  private setSecurityHeaders(res: Response): void {
    res.setHeader('X-Frame-Options', 'DENY');

    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.setHeader('X-XSS-Protection', '1; mode=block');

    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'");

    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  }

  private detectSensitiveData(req: Request): void {
    const body = JSON.stringify(req.body);

    const sensitivePatterns = [
      {
        pattern: /\b\d{13,19}\b/g,
        name: 'Credit Card Number',
      },
      {
        pattern: /\b\d{3,4}\b/g,
        name: 'CVV',
        context: ['cvv', 'cvc', 'securityCode'],
      },
      {
        pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        name: 'Email',
      },
    ];

    sensitivePatterns.forEach(({ pattern, name, context }) => {
      if (pattern.test(body)) {
        if (context) {
          const hasContext = context.some((ctx) => body.toLowerCase().includes(ctx.toLowerCase()));
          if (hasContext) {
            this.logger.warn(
              `⚠️ SECURITY WARNING: Possible ${name} detected in request body. ` +
                `This should be tokenized on the frontend!`,
            );
          }
        } else {
          this.logger.warn(`⚠️ SECURITY WARNING: Possible ${name} pattern detected in request`);
        }
      }
    });
  }
}
