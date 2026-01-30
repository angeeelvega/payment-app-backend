export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  ERROR = 'ERROR',
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly transactionNumber: string,
    public customerEmail: string,
    public customerFirstName: string,
    public customerLastName: string,
    public customerAddress: string,
    public customerDocumentId: string,
    public customerCity: string,
    public productId: string,
    public quantity: number,
    public productAmount: number,
    public baseFee: number,
    public deliveryFee: number,
    public totalAmount: number,
    public status: TransactionStatus,
    public paymentTransactionId?: string,
    public paymentReference?: string,
    public paymentMethod?: string,
    public statusMessage?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  approve(paymentTransactionId: string, paymentReference: string): void {
    this.status = TransactionStatus.APPROVED;
    this.paymentTransactionId = paymentTransactionId;
    this.paymentReference = paymentReference;
    this.statusMessage = 'Payment approved successfully';
  }

  decline(reason: string): void {
    this.status = TransactionStatus.DECLINED;
    this.statusMessage = reason;
  }

  error(errorMessage: string): void {
    this.status = TransactionStatus.ERROR;
    this.statusMessage = errorMessage;
  }

  isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  isApproved(): boolean {
    return this.status === TransactionStatus.APPROVED;
  }
}
