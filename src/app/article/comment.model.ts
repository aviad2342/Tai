import { User } from '../user/user.model';

export class Comment {

    constructor(
      public id: string,
      public articleId: string,
      public authorId: string,
      public body: string,
      public date: Date
    ) {}

}
