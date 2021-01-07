import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.model';
import { Plugins } from '@capacitor/core';
import { UserLogged } from './userLogged.model';
import { UserService } from '../user/user.service';

export interface AuthResponseData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  token: string;
  expiresIn: string;
}

const LOCALHOST = '10.0.0.1';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<UserLogged>(null);
  private activeLogoutTimer: any;
  public loggedUserId: string;


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

  public getLoggedUserId() {
    return this.loggedUserId;
  }

  constructor(private http: HttpClient, private userSrvice: UserService) {}

  getUserLogged() {
    return this.userSrvice.getUser(this._user.value.id);
  }

  isTheCurrentUserLogged(id: string) {
    return (this._user.value.id === id);
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          firstName: string;
          lastName: string;
          email: string;
          useprofilePicturerId: string;
          token: string;
          tokenExpirationDate: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        this.loggedUserId = parsedData.userId;
        const user = new UserLogged(
          parsedData.userId,
          parsedData.firstName,
          parsedData.lastName,
          parsedData.email,
          parsedData.useprofilePicturerId,
          parsedData.token,
          expirationTime
        );
        return user;
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

  // signup(email: string, password: string) {
  //   return this.http
  //     .post<UserLogged>(
  //       `http://localhost:3000/api/auth/login`,
  //       { email, password }
  //     )
  //     .pipe(tap(this.setUserData.bind(this)));
  // }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `http://${LOCALHOST}:3000/api/auth/login`,
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

  private setUserData(userData: AuthResponseData) {
    this.loggedUserId = userData.userId;
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000);
    const user = new UserLogged(
      userData.userId,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.profilePicture,
      userData.token,
      expirationTime
    );
    userData.expiresIn = expirationTime.toISOString();
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData);
  }

  private storeAuthData(userLogged: AuthResponseData) {
    const data = JSON.stringify({
      userId: userLogged.userId,
      firstName: userLogged.firstName,
      lastName: userLogged.lastName,
      email: userLogged.email,
      profilePicture: userLogged.profilePicture,
      token: userLogged.token,
      tokenExpirationDate: userLogged.expiresIn
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }
}
