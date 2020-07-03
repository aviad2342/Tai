import { User } from '../user/user.model';
import { Comment } from './comment.model';

export class Article {

    constructor(
      public id: string,
      public catalogNumber: string,
      public title: string,
      public subtitle: string,
      public body: string,
      public date: Date,
      public thumbnail: string,
      public views: number,
      public author: User,
      public comments: Comment[]
    ) {}

  }
