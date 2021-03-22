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