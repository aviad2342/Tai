import { Customer } from '../customer/customer.model';
import { DeliveryAddress } from '../shared/address.model';
import { OrderItem } from '../store/item.model';

export class Order {

    constructor(
      public id: string,
      public cartId: string,
      public date: Date,
      public note: string,
      public delivery: number,
      public couponCode: string,
      public totalPayment: number,
      public receivedPayment: boolean,
      public confirmPaymentNumber: string,
      public customer: Customer,
      public address: DeliveryAddress,
      public items: OrderItem[],
    ) {}

  }