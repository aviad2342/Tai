export class Item {

      constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public thumbnail: string,
        public images: string[],
        public catalogNumber: string,
        public quantity: number,
        public category: string
      ) {}

    }
