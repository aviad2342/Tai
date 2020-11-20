export class Coupon {

    constructor(
      public code: string,
      public expirationDate: Date,
      public quantity: number,
      public singleItem: boolean,
      public discount: number,
      public usedBy: string[],
    ) {}

  }