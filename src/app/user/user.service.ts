import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // tslint:disable-next-line: variable-name
  private _users = new BehaviorSubject<User[]>([]);

  get users() {
    return this._users.asObservable();
  }

  constructor( private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>('http://localhost:3000/api/user/users')
    .pipe(tap(resDta => {
      this._users.next(resDta);
    }));
  }

  getUser(id: string) {
    return this.http.get<User>(`http://localhost:3000/api/user/users/${id}`)
    .pipe(tap(resDta => {
      return resDta;
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
    return this.http.put(`http://localhost:3000/api/user/users/${user.id}`,
    {
      ...user
    }).
    pipe(
      switchMap(resData => {
        return this.getUsers();
      }),
      tap(users => {
        this._users.next(users);
      }));
  }

}
