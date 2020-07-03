import { User } from '../user/user.model';

export class Comment {

    constructor(
      public articleId: string,
      public id: string,
      public title: string,
      public body: string,
      public date: Date,
      public author: User
    ) {}

}
