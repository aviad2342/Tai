import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Item } from './item.model';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  // tslint:disable-next-line: variable-name
  private _items = new BehaviorSubject<Item[]>([]);


  get items() {
    return this._items.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getItem(id: string) {
    return this.items.pipe(
      take(1),
      map(items => {
        return { ...items.find(p => p.id === id) };
      })
    );
  }

  getItems() {
    return this.http.get<Item[]>('http://localhost:3000/api/item/items')
    .pipe(tap(resDta => {
      this._items.next(resDta);
    }));
  }


}
