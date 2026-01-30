import { CreditCard, CardType } from './credit-card.vo';

describe('CreditCard Value Object', () => {
  describe('Card Type Detection', () => {
    it('should detect VISA card', () => {
      const cardType = CreditCard.detectCardType('4242424242424242');
      expect(cardType).toBe(CardType.VISA);
    });

    it('should detect MASTERCARD card', () => {
      const cardType = CreditCard.detectCardType('5555555555554444');
      expect(cardType).toBe(CardType.MASTERCARD);
    });

    it('should return UNKNOWN for invalid card', () => {
      const cardType = CreditCard.detectCardType('1234567890123456');
      expect(cardType).toBe(CardType.UNKNOWN);
    });
  });

  describe('Card Validation', () => {
    it('should create valid VISA card', () => {
      const card = new CreditCard('4242424242424242', 'John Doe', '12', '28', '123', CardType.VISA);
      expect(card).toBeDefined();
      expect(card.type).toBe(CardType.VISA);
    });

    it('should create valid MASTERCARD card', () => {
      const card = new CreditCard(
        '5555555555554444',
        'Jane Smith',
        '06',
        '28',
        '456',
        CardType.MASTERCARD,
      );
      expect(card).toBeDefined();
      expect(card.type).toBe(CardType.MASTERCARD);
    });

    it('should throw error for invalid card number', () => {
      expect(() => {
        new CreditCard('1234567890123456', 'John Doe', '12', '28', '123', CardType.UNKNOWN);
      }).toThrow('Invalid credit card number');
    });

    it('should throw error for expired card', () => {
      expect(() => {
        new CreditCard('4242424242424242', 'John Doe', '01', '20', '123', CardType.VISA);
      }).toThrow('Invalid expiration date');
    });

    it('should throw error for invalid CVV', () => {
      expect(() => {
        new CreditCard('4242424242424242', 'John Doe', '12', '28', '12', CardType.VISA);
      }).toThrow('Invalid CVV');
    });
  });

  describe('Masked Number', () => {
    it('should return masked card number', () => {
      const card = new CreditCard('4242424242424242', 'John Doe', '12', '28', '123', CardType.VISA);
      expect(card.getMaskedNumber()).toBe('**** **** **** 4242');
    });
  });
});
