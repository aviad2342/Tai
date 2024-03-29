import { Customer } from '../customer/customer.model';
import { CartItem } from '../store/item.model';

export class Cart {

    constructor(
      public id: string,
      public items?: CartItem[],
      public orderId?: string,
    ) {}

  }