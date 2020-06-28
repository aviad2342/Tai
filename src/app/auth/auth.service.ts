import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.model';
import { Plugins } from '@capacitor/core';
import { UserLogged } from './userLogged.model';

// export interface AuthResponseData {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePicture: string;
//   token: string;
//   expiresIn: string;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<UserLogged>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) {}

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as UserLogged;
        const expirationTime = new Date(parsedData.tokenDuration);
        if (expirationTime <= new Date()) {
          return null;
        }
        // const user = parsedData;
        return parsedData;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  signup(email: string, password: string) {
    return this.http
      .post<UserLogged>(
        `http://localhost:3000/api/auth/login`,
        { email, password }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<UserLogged>(
        `http://localhost:3000/api/auth/login`,
        { email, password }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: UserLogged) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.tokenDuration * 1000
    );
    const user = new UserLogged(
      userData.id,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.profilePicture,
      userData.token,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(user);
  }

  private storeAuthData(userLogged: UserLogged) {
    const data = JSON.stringify(userLogged);
    Plugins.Storage.set({ key: 'authData', value: data });
  }
}
