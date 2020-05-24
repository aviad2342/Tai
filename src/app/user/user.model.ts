export class User {

  // public id: string;
  // public firstName: string;
  // public lastName: string;
  // public password: string;
  // public phone: string;
  // public email: string;
  // public date: Date;
  // public country: string;
  // public city: string;
  // public street: string;
  // public houseNumber: string;
  // public apartment: string;
  // public entry: string;
  // public profilePicture: string;

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
     // private Token: string,
     // private tokenExpirationDate: Date
    ) {}
    // get token() {
    //   if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
    //     return null;
    //   }
    //   return this.Token;
    // }

    // get tokenDuration() {
    //   if (!this.token) {
    //     return 0;
    //   }
    //   return this.tokenExpirationDate.getTime() - new Date().getTime();
    // }
  }

// export interface UserUpdate {
//    firstName: string;
//    lastName: string;
//    password: string;
//    phone: string;
//    email: string;
//    date: Date;
//    country: string;
//    city: string;
//    street: string;
//    houseNumber: string;
//    apartment: string;
//    entry: string;
//    profilePicture: string;
//   }
