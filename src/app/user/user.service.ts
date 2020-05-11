import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

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

}
