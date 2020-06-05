import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor( private http: HttpClient ) { }

  getCountries() {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/countries`)
      .pipe(
      map(countriesSet => {
        const countries: string[] = [];
        countriesSet.forEach(element => {
          countries.push(element.he);
        });
        return countries;
      })
    );
  }

  getCountriesPrediction(country: string) {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/countries/${country}`)
      .pipe(
      map(predictions => {
        const countries: string[] = [];
        predictions.forEach(element => {
          countries.push(element.he);
        });
        return countries;
      })
    );
  }

  getCities() {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/cities`)
      .pipe(
      map(citiesSet => {
        const cities: string[] = [];
        citiesSet.forEach(element => {
          cities.push(element.name);
        });
        return cities;
      })
    );
  }

  getCitiesPrediction(city: string) {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/cities/${city}`)
      .pipe(
      map(predictions => {
        const cities: string[] = [];
        predictions.forEach(element => {
          cities.push(element.name);
        });
        return cities;
      })
    );
  }
}
