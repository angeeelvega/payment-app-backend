export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Delivery {
  constructor(
    public readonly id: string,
    public transactionId: string,
    public customerEmail: string,
    public customerDocumentId: string,
    public productId: string,
    public quantity: number,
    public address: string,
    public city: string,
    public status: DeliveryStatus,
    public estimatedDeliveryDate?: Date,
    public deliveredAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  markAsInTransit(): void {
    this.status = DeliveryStatus.IN_TRANSIT;
  }

  markAsDelivered(): void {
    this.status = DeliveryStatus.DELIVERED;
    this.deliveredAt = new Date();
  }

  cancel(): void {
    this.status = DeliveryStatus.CANCELLED;
  }
}
