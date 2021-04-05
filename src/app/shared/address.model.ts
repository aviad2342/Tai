export class Address {

    public id: string;
    public country: string;
    public city: string;
    public street: string;
    public houseNumber: string;
    public apartment: string;
    public entry: string;

    constructor() {}

    setAddress(id: string, country: string, city: string, street: string, houseNumber: string, apartment: string, entry: string) {
      this.id = id;
      this.country = country;
      this.city = city;
      this.street = street;
      this.houseNumber = houseNumber;
      this.apartment = apartment;
      this.entry = entry;
    }

}


export class DeliveryAddress extends Address {

  public id: string;
  public country: string;
  public city: string;
  public street: string;
  public houseNumber: string;
  public apartment: string;
  public entry: string;
  public zipCode?: string;

  constructor() {
    super();
  }

  setDeliveryAddress(id: string,
    country: string,
    city: string,
    street: string,
    houseNumber: string,
    apartment: string,
    entry: string,
    zipCode = '')
   {
    this.id = id;
    this.country = country;
    this.city = city;
    this.street = street;
    this.houseNumber = houseNumber;
    this.apartment = apartment;
    this.entry = entry;
    this.zipCode = zipCode;
  }

}