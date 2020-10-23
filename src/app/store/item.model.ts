export enum Category {
  BOOKS = 'ספרים',
  TREATMENTS = 'טיפולים',
  CONFERENCES = 'כנסים',
  COURSES = 'קורסים',
  ARTICLES = 'מאמרים',
  ACCESSORIES = 'אביזרים',
  OTHER = 'אחר'
}

export class Item {

      constructor(
        public id: string,
        public productId: string,
        public name: string,
        public description: string,
        public price: number,
        public thumbnail: string,
        public catalogNumber: string,
        public quantity: number,
        public category: string
      ) {}

    }
