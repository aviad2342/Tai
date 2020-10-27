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
      public country: string,
      public city: string,
      public street: string,
      public houseNumber: string,
      public apartment: string,
      public entry: string,
      public profilePicture: string,
    ) {
        super(
            id,
            firstName,
            lastName,
            password,
            phone,
            email,
            date,
            country,
            city,
            street,
            houseNumber,
            apartment,
            entry,
            profilePicture
            );
    }

  }