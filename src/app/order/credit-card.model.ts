export class CreditCard {

    constructor(
      public cardNumber: string,
      public ownerId: string,
      public ownerName: string,
      public expirationDate: Date,
      public cvv: string,
      public totalPayment: number
    ) {}

  }