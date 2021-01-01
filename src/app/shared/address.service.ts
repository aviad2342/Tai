import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface Locations {
  n: string;
  id: string;
  sym: string;
}

export interface CitiesLocations {
  locations: Locations[];
}

export interface StreetsLocations {
  streets: Locations[];
}

const LOCALHOST = '10.0.2.2';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor( private http: HttpClient ) { }

  getCountries() {
    return this.http.get<string[]>(
      `http://${LOCALHOST}:3000/api/address/countries`)
      .pipe(tap(countries => {
        return countries;
      }));
  }

  getCountriesPrediction(country: string) {
    return this.http.get<string[]>(
      `http://${LOCALHOST}:3000/api/address/countries/${country}`)
      .pipe(tap(countries => {
        return countries;
      }));
  }

  getCities() {
    return this.http.get<string[]>(
      `http://${LOCALHOST}:3000/api/address/cities`)
      .pipe(tap(cities => {
        return cities;
      }));
  }

  getCitiesPrediction(city: string) {
    return this.http.get<string[]>(
      `http://${LOCALHOST}:3000/api/address/cities/${city}`)
      .pipe(tap(cities => {
        return cities;
      }));
  }

  getCityStreets(city: string) {
    return this.http.get<string[]>(
      `http://${LOCALHOST}:3000/api/address/streets/${city}`)
      .pipe(tap(streets => {
        return streets;
      }));
  }

  getStreetsPrediction(city: string, street: string) {
    return this.http.get<string[]>(
      `http://${LOCALHOST}:3000/api/address/city/streets/${city}/${street}`)
      .pipe(tap(streets => {
        return streets;
      }));
  }

  getZipCode(city: string, street: string, house: string) {
    return this.http.get(
      `https://www.israelpost.co.il/zip_data.nsf/SearchZip?OpenAgent&Location=${city}&Street=${street}&House=${house}`, {responseType: 'text'})
      .pipe(tap(zipCode => {
        return zipCode;
      }));
  }

  // --------------------------------------------------- Israeli Post API ---------------------------------------------

  getPostCitiesPrediction(city: string) {
    return this.http.get<CitiesLocations>(
      `https://www.israelpost.co.il/zip_data1.nsf/CreateLocationsforAutocompleteJSON?OpenAgent&StartsWith=${city}`)
      .pipe(map(locations => {
        console.log(locations);
        const cities = locations.locations.map(item => {
          return item.n;
        });
        return cities;
      }));
  }

  getPostStreetsPrediction(city: string, street: string) {
    return this.http.get<StreetsLocations>(
      `https://www.israelpost.co.il/zip_data1.nsf/CreateStreetsforAutocompleteJSON?OpenAgent&callback=&Location=${city}&StartsWith=${street}`)
      .pipe(map(locations => {
        const streets = locations.streets.map(item => {
          return item.n;
        });
        return streets;
      }));
  }

  getPostZipCode(city: string, street: string, house: string, entrance = '') {
    return this.http.get(
      // tslint:disable-next-line: max-line-length
      `https://www.israelpost.co.il/zip_data.nsf/SearchZip?OpenAgent&Location=${city}&Street=${street}&House=${house}&Entrance=${entrance}`, {responseType: 'text'})
      .pipe(tap(zipCode => {
        return zipCode;
      }));
  }

}
