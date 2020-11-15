export class Address {

    public country: string;
    public city: string;
    public street: string;
    public houseNumber: string;
    public apartment: string;
    public entry: string;

    constructor() {}

    setAddress(country: string, city: string, street: string, houseNumber: string, apartment: string, entry: string) {
      this.country = country;
      this.city = city;
      this.street = street;
      this.houseNumber = houseNumber;
      this.apartment = apartment;
      this.entry = entry;
    }

}


export class DeliveryAddress extends Address {

  public country: string;
  public city: string;
  public street: string;
  public houseNumber: string;
  public apartment: string;
  public entry: string;
  public note: string;

  constructor() {
    super();
  }

  setDeliveryAddress(country: string, city: string, street: string, houseNumber: string, apartment: string, entry: string, note: string) {
    this.country = country;
    this.city = city;
    this.street = street;
    this.houseNumber = houseNumber;
    this.apartment = apartment;
    this.entry = entry;
    this.note = entry;
  }

}