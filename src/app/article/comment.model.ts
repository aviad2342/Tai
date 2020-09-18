import { Article } from './article.model';

export class Comment {

    constructor(
      public id: string,
      public authorId: string,
      public authorName: string,
      public body: string,
      public date: Date,
      public article: string
    ) {}

}
