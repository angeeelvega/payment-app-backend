export interface PaymentRequest {
  amount: number;
  currency: string;
  cardToken: string;
  cardHolder: string;
  installments: number;
  reference: string;
  customerEmail: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  status?: string;
  statusMessage?: string;
  errorMessage?: string;
}

export interface PaymentGatewayPort {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  getTransactionStatus(transactionId: string): Promise<PaymentResponse>;
}

export const PAYMENT_GATEWAY_PORT = Symbol('PAYMENT_GATEWAY_PORT');
