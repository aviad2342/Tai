export enum speakerTitle {
    MISTER  = 'מר',
    MISS = 'גב\'',
    DOCTOR = 'ד"ר',
    PROFESSOR = 'פרופ\''
  }

export class Speaker {

    constructor(
      public id: string,
      public title: speakerTitle,
      public firstName: string,
      public lastName: string,
      public description: string,
      public picture: string,
      public event: string
    ) {}

  }

//   export class Lecturer extends Speaker {
//     constructor(
//       public id: string,
//       public title: speakerTitle,
//       public firstName: string,
//       public lastName: string,
//       public description: string,
//       public picture: string,
//       public event: string
//       ) {
//       super(id, title, firstName, lastName, description, picture, event);
//     }
// }
