import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PasswordReset } from '../user/password-reset.model';
import { Registered } from './registered.model';

export interface AuthResponseData {
  id: string;
  firstName: string;
  lastName: string;
  success: boolean;
  verified: boolean;
  alreadyVerified: boolean;
  userSaved: boolean;
  UpdateRegisteredUser: boolean;
  notRegistered: boolean;
}

const LOCALHOST = environment.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private _registeredUsers = new BehaviorSubject<Registered[]>([]);

  get registeredUsers() {
    return this._registeredUsers.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getRegisteredUsers() {
    return this.http.get<Registered[]>(`http://${LOCALHOST}:3000/api/register/users`)
    .pipe(tap(resData => {
      this._registeredUsers.next(resData);
    }));
  }

  getRegisteredUser(id: string) {
    return this.http.get<Registered>(`http://${LOCALHOST}:3000/api/register/user/${id}`)
    .pipe(tap(resData => {
      return resData;
    }));
  }

  verifyRegisteredUser(token: string) {
    return this.http.get<AuthResponseData>(`http://${LOCALHOST}:3000/api/register/verify/${token}`)
    .pipe(tap(resData => {
      return resData;
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

  registerUser(registerUser: Registered) {
    return this.http.post<Registered>(`http://${LOCALHOST}:3000/api/register/user`,
    {
      ...registerUser
    }).
    pipe(
      tap(newRegisteredUser => {
        return newRegisteredUser;
      }));
  }

  deleteRegisteredUser(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/register/user/${id}`).
    pipe(
      switchMap(resData => {
        return this.getRegisteredUsers();
      }),
      tap(registeredUsers => {
        this._registeredUsers.next(registeredUsers.filter(u => u.id !== id));
      }));
  }

  getRegisteredUserByEmail(email: string) {
    return this.http
      .get<Registered>(
        `http://${LOCALHOST}:3000/api/register/user/email/${email}`)
      .pipe(tap(user => {
        return user;
      }));
  }

  resetUserPassword(passwordReset: PasswordReset) {
    return this.http.post<PasswordReset>(`http://${LOCALHOST}:3000/api/register/user/resetpassword`,
     {
       ...passwordReset
    }).pipe(tap(resData => {
        return resData;
    }));
  }


}
