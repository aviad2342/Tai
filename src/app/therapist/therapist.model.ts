import { Cart } from '../cart/cart.model';
import { Order } from '../order/order.model';
import { Address } from '../shared/address.model';
import { UserPreferences } from '../user/user-preferences.model';
import { User } from '../user/user.model';

export class Therapist extends User {

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
      public treatmentTypes: string[],
      public resume: string,
      public admin: boolean,
      public preferences?: UserPreferences,
      public savedVideos?: string[],
      public cart?: Cart,
      public orders?: Order[],
    ) {
        super(
            id,
            firstName,
            lastName,
            password,
            phone,
            email,
            date,
            profilePicture,
            address,
            preferences,
            savedVideos,
            cart,
            orders
            );
    }

  }