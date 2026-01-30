export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public imageUrl?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  hasStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  decreaseStock(quantity: number): void {
    if (!this.hasStock(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }

  increaseStock(quantity: number): void {
    this.stock += quantity;
  }
}
