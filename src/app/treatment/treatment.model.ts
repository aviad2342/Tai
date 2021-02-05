
export class Treatment {

    constructor(
      public id: string,
      public treatmentName: string,
      public treatmentType: string,
      public description: string,
      public thumbnail: string,
      public catalogNumber: string,
      public therapistId: string,
      public therapistName: string,
      public therapistProfilePicture: string
    ) {}

  }