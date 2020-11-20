import { Customer } from '../customer/customer.model';
import { DeliveryAddress } from '../shared/address.model';
import { CartItem } from '../store/item.model';

export class Order {

    constructor(
      public id: string,
      public date: Date,
      public note: string,
      public totalPayment: number,
      public receivedPayment: boolean,
      public customer: Customer,
      public address: DeliveryAddress,
      public items: CartItem[],
    ) {}

  }