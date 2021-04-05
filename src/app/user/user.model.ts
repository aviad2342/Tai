import { Cart } from '../cart/cart.model';
import { Order } from '../order/order.model';
import { Address } from '../shared/address.model';
import { UserPreferences } from './user-preferences.model';

export class User {

    constructor(
      public id: string,
      public firstName: string,
      public lastName: string,
      public password: string,
      public phone: string,
      public email: string,
      public date: Date,
      public profilePicture: string,
      public address: Address,
      public preferences?: UserPreferences,
      public savedVideos?: string[],
      public cart?: Cart,
      public orders?: Order[]
    ) {}

  }
