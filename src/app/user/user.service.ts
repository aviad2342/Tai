import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from 'src/environments/environment';
import { PasswordReset } from './password-reset.model';
import { Address } from '../shared/address.model';
import { UserPreferences } from './user-preferences.model';
import { Cart } from '../cart/cart.model';
import { Order } from '../order/order.model';

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

  private _user = new BehaviorSubject<User>(null);

  get users() {
    return this._users.asObservable();
  }

  get user() {
    return this._user.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getUsers() {
    return this.http.get<User[]>(`http://${LOCALHOST}:3000/api/user/users`)
    .pipe(tap(resData => {
      this._users.next(resData);
    }));
  }

  getAllUsers() {
    return this.http.get(`http://${LOCALHOST}:3000/api/user/users`)
    .pipe(tap(resData => {
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
    .pipe(tap(resData => {
      return resData;
    }));
  }

  getUserAddress(id: string) {
    return this.http.get<Address>(`http://${LOCALHOST}:3000/api/user/address/${id}`)
    .pipe(tap(resData => {
      return resData;
    }));
  }

  getUserPreferences(id: string) {
    return this.http.get<UserPreferences>(`http://${LOCALHOST}:3000/api/user/preferences/${id}`)
    .pipe(tap(resData => {
      return resData;
    }));
  }

  getUserCart(id: string) {
    return this.http.get<Cart>(`http://${LOCALHOST}:3000/api/user/cart/${id}`)
    .pipe(tap(resData => {
      return resData;
    }));
  }

  getUserOrders(id: string) {
    return this.http.get<Order[]>(`http://${LOCALHOST}:3000/api/user/orders/${id}`)
    .pipe(tap(resData => {
      return resData;
    }));
  }

  getFullUser(id: string) {
    return this.http.get<User>(`http://${LOCALHOST}:3000/api/user/full/${id}`)
    .pipe(tap(resData => {
      this._user.next(resData);
      return resData;
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
      firstName:      user.firstName,
      lastName:       user.lastName,
      email:          user.email,
      phone:          user.phone,
      password:       user.password,
      date:           user.date,
      profilePicture: user.profilePicture,
      address:        user.address,
      preferences:    user.preferences,
      savedVideos:    user.savedVideos,
      cart:           user.cart,
      orders:         user.orders
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

  updateFullUser(user: User) {
    const userObj = {
      firstName:      user.firstName,
      lastName:       user.lastName,
      email:          user.email,
      phone:          user.phone,
      password:       user.password,
      date:           user.date,
      profilePicture: user.profilePicture,
      address:        user.address,
      preferences:    user.preferences,
      savedVideos:    user.savedVideos,
      cart:           user.cart,
      orders:         user.orders
      };
    return this.http.put(`http://${LOCALHOST}:3000/api/user/full/${user.id}`,
    {
      ...userObj
    }).
    pipe(
      switchMap(resData => {
        return this.getUsers();
      }),
      switchMap(users => {
        this._users.next(users);
        return this.getFullUser(user.id);
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
      firstName:      user.firstName,
      lastName:       user.lastName,
      email:          user.email,
      phone:          user.phone,
      password:       user.password,
      date:           user.date,
      profilePicture: user.profilePicture,
      address:        user.address,
      preferences:    user.preferences,
      savedVideos:    user.savedVideos,
      cart:           user.cart,
      orders:         user.orders
      };
    return this.http.put<PasswordReset>(`http://${LOCALHOST}:3000/api/user/password/${user.id}/${token}`,
    {
      ...userObj
    }).pipe(tap(resDta => {
      return resDta;
    }));
  }

}
