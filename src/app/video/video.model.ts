export class Video {

    constructor(
      public id: string,
      public videoId: string,
      public videoURL: string,
      public embed: string,
      public title: string,
      public description: string,
      public date: Date,
      public thumbnail: string
    ) {}

  }