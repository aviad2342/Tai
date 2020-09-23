import { Speaker } from './speaker.model';

export class Event {

    constructor(
      public id: string,
      public title: string,
      public description: string,
      public date: Date,
      public beginsAt: Date,
      public endsAt: Date,
      public thumbnail: string,
      public maxCapacity: number,
      public placeName: string,
      public country: string,
      public city: string,
      public street: string,
      public houseNumber: string,
      public apartment: string,
      public entry: string,
      public catalogNumber: string,
      public images: string[],
      public speakers: Speaker[]
    ) {}

  }
