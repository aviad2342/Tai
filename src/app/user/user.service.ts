import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from 'src/environments/environment';
import { PasswordReset } from './password-reset.model';

const LOCALHOST = environment.LOCALHOST;

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
  // countries: string[] = [];

  get users() {
    return this._users.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getUsers() {
    return this.http.get<User[]>(`http://${LOCALHOST}:3000/api/user/users`)
    .pipe(tap(resDta => {
      this._users.next(resDta);
    }));
  }

  getAllUsers() {
    return this.http.get(`http://${LOCALHOST}:3000/api/user/users`)
    .pipe(tap(resDta => {
    }));
  }

  getCountries(country: string) {
    return this.http.get<any>(
      // tslint:disable-next-line: max-line-length
      `http://thingproxy.freeboard.io/fetch/http://maps.googleapis.com/maps/api/place/autocomplete/json?input=${country}&types=(cities)&language=he&key=AIzaSyDqb_--ZW9Sn4l75YuinoYD2Fgeu6gQkGY`
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
      `http://${LOCALHOST}:3000/api/address/cities/${country}`)
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
      `http://thingproxy.freeboard.io/fetch/http://maps.googleapis.com/maps/api/place/autocomplete/json?input=בני&types=(cities)&language=he&key=AIzaSyDqb_--ZW9Sn4l75YuinoYD2Fgeu6gQkGY`
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
    return this.http.get<User>(`http://${LOCALHOST}:3000/api/user/user/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  getUserByEmail(email: string) {
    return this.http
      .get<User>(
        `http://${LOCALHOST}:3000/api/user/user/email/${email}`)
      .pipe(tap(user => {
        return user;
      }));
  }

  uploadImage(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      `http://${LOCALHOST}:3000/api/image/upload`,
      uploadData
    );
  }

  addUser(user: User) {
    return this.http.post<{id: string}>(`http://${LOCALHOST}:3000/api/user/user`,
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

  registerUser(user: User) {
    return this.http.post<User>(`http://${LOCALHOST}:3000/api/user/register`,
    {
      ...user
    }).
    pipe(
      tap(newUser => {
        return newUser;
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
    return this.http.put(`http://${LOCALHOST}:3000/api/user/user/${user.id}`,
    {
      ...userObj
    }).
    pipe(
      switchMap(resData => {
        return this.getUsers();
      }),
      switchMap(users => {
        this._users.next(users);
        return users.filter(u => u.id === user.id);
      }),
      take(1),
      tap(userData => {
        return userData;
      }));
  }

  updateUserAndProfilePicture(user: User) {
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
    return this.http.put(`http://${LOCALHOST}:3000/api/user/user/image/${user.id}`,
    {
      ...userObj
    }).
    pipe(
      switchMap(resData => {
        return this.getUsers();
      }),
      switchMap(users => {
        this._users.next(users);
        return users.filter(u => u.id === user.id);
      }),
      take(1),
      tap(userData => {
        return userData;
      }));
  }

  deleteUser(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/user/user/${id}`).
    pipe(
      switchMap(resData => {
        return this.getUsers();
      }),
      tap(users => {
        this._users.next(users.filter(u => u.id !== id));
      }));
  }

  getPasswordReset(token: string) {
    return this.http.get<PasswordReset>(`http://${LOCALHOST}:3000/api/user/resetpassword/${token}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  updateUserPassword(user: User, token: string) {
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
    return this.http.put<PasswordReset>(`http://${LOCALHOST}:3000/api/user/user/${user.id}/${token}`,
    {
      ...userObj
    }).pipe(tap(resDta => {
      return resDta;
    }));
  }

}
