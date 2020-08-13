export class Lesson {

    constructor(
      public id: string,
      public courseId: string,
      public videoId: string,
      public videoURL: string,
      public lessonNumber: number,
      public title: string,
      public description: string,
      public date: Date,
      public thumbnail: string
    ) {}

  }