import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor( private http: HttpClient ) { }

  getCities(country: string) {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `http://localhost:3000/api/address/cities/${country}`)
      .pipe(
      map(predictions => {
        const countries: string[] = [];
        predictions.forEach(element => {
          countries.push(element.name);
        });
        return countries;
      })
    );
  }
}
