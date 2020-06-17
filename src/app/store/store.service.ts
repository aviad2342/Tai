import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { Item } from './item.model';
import { take, map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class StoreService {

  // tslint:disable-next-line: variable-name
  private _items = new BehaviorSubject<Item[]>([
    new Item(
      '1',
      'הספר של גדי',
      'קורות חייו של גדי וילצנסקי',
      19.99,
      'https://www.hook.co.il/wp-content/uploads/2019/03/gadi-book.jpg',
      null,
      '444552',
      40
    ),
    new Item(
      '2',
      'הספר של גדי',
      'קורות חייו של גדי וילצנסקי',
      19.99,
      'https://www.e-vrit.co.il/Images/Products/covers_2019/bishul_master.jpg',
      null,
      '444552',
      40
    ),
    new Item(
      '3',
      'הספר של גדי',
      'קורות חייו של גדי וילצנסקי',
      19.99,
      'https://www.hook.co.il/wp-content/uploads/2019/03/gadi-book.jpg',
      null,
      '444552',
      40
    ),
    new Item(
      '4',
      'הספר של גדי',
      'קורות חייו של גדי וילצנסקי',
      19.99,
      'https://www.hook.co.il/wp-content/uploads/2019/03/gadi-book.jpg',
      null,
      '444552',
      40
    ),
    new Item(
      '5',
      'הספר של גדי',
      'קורות חייו של גדי וילצנסקי',
      19.99,
      'https://www.e-vrit.co.il/Images/Products/covers_2019/bishul_master.jpg',
      null,
      '444552',
      40
    ),
    new Item(
      '6',
      'הספר של גדי',
      'קורות חייו של גדי וילצנסקי',
      19.99,
      'https://www.hook.co.il/wp-content/uploads/2019/03/gadi-book.jpg',
      null,
      '444552',
      40
    )
  ]);


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


}
