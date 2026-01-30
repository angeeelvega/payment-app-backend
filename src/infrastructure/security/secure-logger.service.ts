import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecureLoggerService {
  private readonly logger = new Logger(SecureLoggerService.name);

  private sanitize(data: any): any {
    if (typeof data === 'string') {
      return this.maskSensitiveString(data);
    }

    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = Array.isArray(data) ? [] : {};

    for (const key in data) {
      const lowerKey = key.toLowerCase();

      if (this.isSensitiveField(lowerKey)) {
        sanitized[key] = '***REDACTED***';
        continue;
      }

      if (this.isPartiallyVisibleField(lowerKey)) {
        sanitized[key] = this.maskToken(data[key]);
        continue;
      }

      sanitized[key] = this.sanitize(data[key]);
    }

    return sanitized;
  }

  /**
   * Determinar si un campo es sensible y debe ocultarse
   */
  private isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'cardnumber',
      'card_number',
      'cvv',
      'cvc',
      'securitycode',
      'password',
      'secret',
      'privatekey',
      'apikey',
      'authorization',
    ];

    return sensitiveFields.some((field) => fieldName.includes(field));
  }

  /**
   * Determinar si un campo debe mostrarse parcialmente
   */
  private isPartiallyVisibleField(fieldName: string): boolean {
    const partialFields = ['token', 'reference', 'transactionid', 'customerid'];
    return partialFields.some((field) => fieldName.includes(field));
  }

  private maskSensitiveString(str: string): string {
    return str.replace(/\b\d{13,19}\b/g, (match) => {
      const first4 = match.slice(0, 4);
      const last4 = match.slice(-4);
      const middle = '*'.repeat(match.length - 8);
      return `${first4}${middle}${last4}`;
    });
  }

  /**
   * Enmascarar tokens (mostrar solo inicio y fin)
   */
  private maskToken(token: string): string {
    if (!token || token.length < 10) {
      return '***';
    }
    const visible = 8; // Mostrar 4 caracteres al inicio y 4 al final
    const start = token.slice(0, visible / 2);
    const end = token.slice(-visible / 2);
    const middle = '*'.repeat(token.length - visible);
    return `${start}${middle}${end}`;
  }

  /**
   * Log de información (auto-sanitizado)
   */
  logInfo(message: string, data?: any): void {
    const sanitizedData = data ? this.sanitize(data) : undefined;
    this.logger.log(message, sanitizedData);
  }

  /**
   * Log de error (auto-sanitizado)
   */
  logError(message: string, error: any, data?: any): void {
    const sanitizedData = data ? this.sanitize(data) : undefined;
    this.logger.error(message, error, sanitizedData);
  }

  /**
   * Log de advertencia (auto-sanitizado)
   */
  logWarn(message: string, data?: any): void {
    const sanitizedData = data ? this.sanitize(data) : undefined;
    this.logger.warn(message, sanitizedData);
  }

  /**
   * Log de auditoría para transacciones
   */
  logAudit(action: string, userId: string, details: any): void {
    const auditLog = {
      timestamp: new Date().toISOString(),
      action,
      userId: this.maskToken(userId),
      details: this.sanitize(details),
      ip: '***', // Obtener del request en un caso real
    };

    this.logger.log('AUDIT', auditLog);
  }
}
