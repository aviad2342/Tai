import { Comment } from './comment.model';

export class Article {

    constructor(
      public id: string,
      public authorId: string,
      public authorName: string,
      public catalogNumber: string,
      public title: string,
      public subtitle: string,
      public body: string,
      public date: Date,
      public lastEdit: Date,
      public thumbnail: string,
      public pdf: string,
      public views: number,
      public comments: Comment[],
      public isPublic: boolean
    ) {}

  }
