import { DeliveryAddress } from '../shared/address.model';
import { OrderItem } from '../store/item.model';
import { User } from '../user/user.model';

export class Order {

    constructor(
      public id: string,
      public cartId: string,
      public date: Date,
      public note: string,
      public delivery: number,
      public couponCode: string,
      public totalItems: number,
      public totalPayment: number,
      public receivedPayment: boolean,
      public confirmPaymentNumber: string,
      public address: DeliveryAddress,
      public user: User,
      public items?: OrderItem[],
    ) {}

  }