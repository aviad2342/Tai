export class Coupon {

    constructor(
      public code: string,
      public date: Date,
      public expirationDate: Date,
      public quantity: number,
      public singleItem: boolean,
      public discount: number,
      public itemId?: string
    ) {}

  }