
export class Article {

    constructor(
      public id: string,
      public authorId: string,
      public catalogNumber: string,
      public title: string,
      public subtitle: string,
      public body: string,
      public date: Date,
      public lastEdit: Date,
      public thumbnail: string,
      public views: number,
      public comments: number
    ) {}

  }
