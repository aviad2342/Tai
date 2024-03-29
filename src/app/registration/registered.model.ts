export class Registered {

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
      public registrationDate: Date,
      public verificationDate: Date,
      public verificationToken: string,
      public emailSent: boolean,
      public verified: boolean
    ) {}

  }
