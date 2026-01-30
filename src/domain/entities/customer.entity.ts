export class Customer {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public address: string,
    public city: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
