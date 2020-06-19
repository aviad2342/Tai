export enum speakerTitle {
    MISTER  = 'מר',
    MISS = '\'גב',
    DOCTOR = 'ד"ר',
    PROFESSOR = 'פרופ\''
  }

export class Speaker {

    constructor(
      public id: string,
      public title: speakerTitle,
      public firstName: string,
      public lastName: string,
      public image: string

    ) {}

  }
