import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  PaymentGatewayPort,
  PaymentRequest,
  PaymentResponse,
} from '@application/ports/out/payment-gateway.port';
import * as crypto from 'crypto';

interface PaymentGatewayTransactionResponse {
  status: string;
  data: {
    id: string;
    reference: string;
    status: string;
    status_message: string;
  };
}

@Injectable()
export class PaymentGatewayAdapter implements PaymentGatewayPort {
  private readonly logger = new Logger(PaymentGatewayAdapter.name);
  private readonly httpClient: AxiosInstance;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integrityKey: string;

  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.get<string>('PAYMENT_GATEWAY_BASE_URL');
    this.publicKey = this.configService.get<string>('PAYMENT_GATEWAY_PUBLIC_KEY')!;
    this.privateKey = this.configService.get<string>('PAYMENT_GATEWAY_PRIVATE_KEY')!;
    this.integrityKey = this.configService.get<string>('PAYMENT_GATEWAY_INTEGRITY_KEY')!;

    this.httpClient = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      this.logger.log(`Processing payment with pre-tokenized card`);

      const transactionResult = await this.createTransaction(request, request.cardToken);
      return transactionResult;
    } catch (error) {
      this.logger.error('Error processing payment', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error processing payment',
      };
    }
  }

  async getTransactionStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await this.httpClient.get<PaymentGatewayTransactionResponse>(
        `/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
        },
      );

      const { data } = response.data;

      return {
        success: data.status === 'APPROVED',
        transactionId: data.id,
        reference: data.reference,
        status: data.status,
        statusMessage: data.status_message,
      };
    } catch (error) {
      this.logger.error('Error getting transaction status', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async createTransaction(
    request: PaymentRequest,
    cardToken: string,
  ): Promise<PaymentResponse> {
    try {
      const amountInCents = Math.round(request.amount * 100);
      const reference = request.reference;

      const integritySignature = this.generateIntegritySignature(
        reference,
        amountInCents,
        request.currency,
      );

      this.logger.log(
        `Creating payment gateway transaction - Amount: ${request.amount} (${amountInCents} cents), Currency: ${request.currency}, Reference: ${reference}`,
      );

      const acceptanceToken = await this.getAcceptanceToken();

      const response = await this.httpClient.post<PaymentGatewayTransactionResponse>(
        '/transactions',
        {
          acceptance_token: acceptanceToken,
          amount_in_cents: amountInCents,
          currency: request.currency,
          customer_email: request.customerEmail,
          payment_method: {
            type: 'CARD',
            token: cardToken,
            installments: request.installments,
          },
          reference: reference,
          signature: integritySignature,
        },
        {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
          },
        },
      );

      const { data } = response.data;
      this.logger.log(
        `Payment gateway transaction created - ID: ${data.id}, Initial status: ${data.status}`,
      );

      let statusResult: PaymentResponse;
      let attempts = 0;
      const maxAttempts = 5;

      do {
        attempts++;
        await this.sleep(2000);
        statusResult = await this.getTransactionStatus(data.id);

        this.logger.log(
          `Status check ${attempts}/${maxAttempts} - Status: ${statusResult.status}, Message: ${statusResult.statusMessage}`,
        );

        if (statusResult.status !== 'PENDING') {
          break;
        }
      } while (attempts < maxAttempts && statusResult.status === 'PENDING');

      if (statusResult.status === 'PENDING') {
        this.logger.warn(
          `Transaction still PENDING after ${maxAttempts} attempts - Marking as timeout`,
        );
        return {
          success: false,
          transactionId: data.id,
          status: 'PENDING',
          statusMessage: 'Transaction timeout - still pending after maximum wait time',
          errorMessage: 'Transaction is taking too long to process',
        };
      }

      this.logger.log(`Final transaction status: ${statusResult.status}`);
      return statusResult;
    } catch (error) {
      this.logger.error(
        `Error creating transaction: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`,
      );
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to create transaction',
      };
    }
  }

  private generateIntegritySignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const concatenated = `${reference}${amountInCents}${currency}${this.integrityKey}`;
    return crypto.createHash('sha256').update(concatenated).digest('hex');
  }

  private async getAcceptanceToken(): Promise<string> {
    try {
      const response = await this.httpClient.get('/merchants/' + this.publicKey);
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      this.logger.error('Error getting acceptance token', error);
      throw new Error('Failed to get acceptance token');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
