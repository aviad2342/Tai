export class Course {

    constructor(
      public id: string,
      public authorId: string,
      public catalogNumber: string,
      public title: string,
      public description: string,
      public date: Date,
      public thumbnail: string,
      public courseLessons: number
    ) {}

  }