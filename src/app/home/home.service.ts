import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Update } from './update.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

    // tslint:disable-next-line: variable-name
    private _updates = new BehaviorSubject<Update[]>([
      new Update('1', 'קורס חדש בנושא: אמא שלך', new Date(), new Date(), 'url'),
      new Update('2', 'קורס חדש בנושא: אבא שלך', new Date(), new Date(), 'url'),
      new Update('3', 'קורס חדש בנושא: דוד שלך', new Date(), new Date(), 'url'),
      new Update('4', 'קורס חדש בנושא: דודה שלך', new Date(), new Date(), 'url')
    ]);
    // countries: string[] = [];

    get updates() {
      return this._updates.asObservable();
    }

  constructor( private http: HttpClient ) { }

  getUpdates() {
    return this.updates.pipe(
      map (updates => {
        return updates;
      })
    );
  }
}
