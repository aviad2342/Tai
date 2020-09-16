import { Photo } from './photo.model';

export class Album {

    constructor(
      public id: string,
      public authorId: string,
      public authorName: string,
      public title: string,
      public description: string,
      public date: Date,
      public lastEdit: Date,
      public thumbnail: string,
      public views: number,
      public photos: Photo[]
    ) {}

  }