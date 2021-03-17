export class PasswordReset {

    constructor(
      public token: string,
      public firstName: string,
      public lastName: string,
      public email: string,
      public date: Date,
      public expirationDate: Date,
      public emailSent?: boolean,
      public success?: boolean,
      public activated?: boolean
    ) {}

  }