export enum CardType {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  UNKNOWN = 'UNKNOWN',
}

export class CreditCard {
  constructor(
    public readonly number: string,
    public readonly holderName: string,
    public readonly expirationMonth: string,
    public readonly expirationYear: string,
    public readonly cvv: string,
    public readonly type: CardType,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.isValidCardNumber()) {
      throw new Error('Invalid credit card number');
    }

    if (!this.isValidExpirationDate()) {
      throw new Error('Invalid expiration date');
    }

    if (!this.isValidCVV()) {
      throw new Error('Invalid CVV');
    }
  }

  private isValidCardNumber(): boolean {
    const digits = this.number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digits)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private isValidExpirationDate(): boolean {
    const month = parseInt(this.expirationMonth, 10);
    const year = parseInt(this.expirationYear, 10);

    if (month < 1 || month > 12) {
      return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const fullYear = year < 100 ? 2000 + year : year;

    if (fullYear < currentYear) {
      return false;
    }

    if (fullYear === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  }

  private isValidCVV(): boolean {
    return /^\d{3,4}$/.test(this.cvv);
  }

  static detectCardType(cardNumber: string): CardType {
    const digits = cardNumber.replace(/\s/g, '');

    if (/^4/.test(digits)) {
      return CardType.VISA;
    }

    if (
      /^5[1-5]/.test(digits) ||
      /^2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(digits)
    ) {
      return CardType.MASTERCARD;
    }

    return CardType.UNKNOWN;
  }

  getMaskedNumber(): string {
    const digits = this.number.replace(/\s/g, '');
    const lastFour = digits.slice(-4);
    return `**** **** **** ${lastFour}`;
  }
}
