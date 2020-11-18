import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor( private http: HttpClient ) { }

  getCountries() {
    return this.http.get<string[]>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/countries`)
      .pipe(tap(countries => {
        return countries;
      }));
  }

  getCountriesPrediction(country: string) {
    return this.http.get<string[]>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/countries/${country}`)
      .pipe(tap(countries => {
        return countries;
      }));
  }

  getCities() {
    return this.http.get<string[]>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/cities`)
      .pipe(tap(cities => {
        return cities;
      }));
  }

  getCitiesPrediction(city: string) {
    return this.http.get<string[]>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/cities/${city}`)
      .pipe(tap(cities => {
        return cities;
      }));
  }

  getCityStreets(city: string) {
    return this.http.get<string[]>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/streets/${city}`)
      .pipe(tap(streets => {
        return streets;
      }));
  }

  getStreetsPrediction(city: string, street: string) {
    return this.http.get<string[]>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/streets/${city}/${street}`)
      .pipe(tap(streets => {
        return streets;
      }));
  }


}
