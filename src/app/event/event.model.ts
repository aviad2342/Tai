import { Time } from '@angular/common';

export class Event {

    constructor(
      public id: string,
      public title: string,
      public description: string,
      public date: Date,
      public beginsAt: Time,
      public endsAt: Time,
      public thumbnail: string,
      public images: string[],
      public speakers: string,
      public maxCapacity: number,
      public place: string,
      public country: string,
      public city: string,
      public street: string,
      public houseNumber: string,
      public apartment: string,
      public entry: string
    ) {}

  }
