export class Update {

    constructor(
      public id: string,
      public updateType: string,
      public description: string,
      public date: Date,
      public endUpdate: Date,
      public url: string,
      public active: boolean,
      public productId?: string
    ) {}

  }

  export class ProductData {

    constructor(
      public id: string,
      public name: string,
      public description: string,
      public type: string,
      public url: string,
      public thumbnail?: string
    ) {}

  }