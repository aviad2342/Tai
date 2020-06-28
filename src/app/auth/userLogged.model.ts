export class UserLogged {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public profilePicture: string,
        private Token: string,
        private tokenExpirationDate: Date
      ) {}
      get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
          return null;
        }
        return this.Token;
      }

      get tokenDuration() {
        if (!this.token) {
          return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
      }
    }
