import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { User } from './user.model';

export interface Predictions {
  country: string;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tslint:disable-next-line: variable-name
  private _users = new BehaviorSubject<User[]>([]);
  countries: string[] = [];

  get users() {
    return this._users.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getUsers() {
    return this.http.get<User[]>('http://localhost:3000/api/user/users')
    .pipe(tap(resDta => {
      this._users.next(resDta);
    }));
  }

  getCountries(country: string) {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `https://thingproxy.freeboard.io/fetch/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${country}&types=(cities)&language=he&key=AIzaSyDqb_--ZW9Sn4l75YuinoYD2Fgeu6gQkGY`
    ).pipe(
      map(predictions => {
        const countries: string[] = [];
        predictions.predictions.forEach(element => {
          countries.push(element.structured_formatting.main_text);
        });
        return countries;
      })
    );
  }

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

  getAddress() {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `https://thingproxy.freeboard.io/fetch/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=בני&types=(cities)&language=he&key=AIzaSyDqb_--ZW9Sn4l75YuinoYD2Fgeu6gQkGY`
    ).pipe(
      map(predictions => {
        const countries: string[] = [];
        predictions.predictions.forEach(element => {
          countries.push(element.structured_formatting.main_text);
        });
        return countries;
      })
    ).subscribe(countries => {
      console.log(countries);
      // console.log(predictions.predictions[0].structured_formatting.main_text);
    });
  }

  getUser(id: string) {
    return this.http.get<User>(`http://localhost:3000/api/user/users/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  getUserByEmail(email: string) {
    return this.http
      .get<User>(
        `http://localhost:3000/api/user/users/email/${email}`)
      .pipe(tap(user => {
        return user;
      }));
  }

  uploadImage(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      'http://localhost:3000/api/image/upload',
      uploadData
    );
  }

  addUser(user: User) {
    return this.http.post<{id: string}>('http://localhost:3000/api/user/users',
    {
      ...user
    }).
    pipe(
      switchMap(resData => {
        user.id = resData.id;
        return this.users;
      }),
      take(1),
      tap(users => {
        this._users.next(users.concat(user));
      }));
  }

  updateUser(user: User) {
    const userObj = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      date: user.date,
      country: user.country,
      city: user.city,
      street: user.street,
      houseNumber: user.houseNumber,
      apartment: user.apartment,
      entry: user.entry,
      profilePicture: user.profilePicture
      };
    return this.http.put(`http://localhost:3000/api/user/users/${user.id}`,
    {
      ...userObj
    }).
    pipe(
      switchMap(resData => {
        return this.getUsers();
      }),
      tap(users => {
        this._users.next(users);
      }));
  }

  deleteUser(id: string) {
    return this.http.delete(`http://localhost:3000/api/user/users/${id}`).
    pipe(
      switchMap(resData => {
        return this.getUsers();
      }),
      tap(users => {
        this._users.next(users.filter(u => u.id !== id));
      }));
  }

}
