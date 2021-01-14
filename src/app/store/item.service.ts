import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Item } from './item.model';

const LOCALHOST = '10.0.0.1';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

    // tslint:disable-next-line: variable-name
  private _items = new BehaviorSubject<Item[]>([]);


  get items() {
    return this._items.asObservable();
  }

  constructor( private http: HttpClient ) { }

  // getItem(id: string) {
  //   return this.items.pipe(
  //     take(1),
  //     map(items => {
  //       return { ...items.find(p => p.id === id) };
  //     })
  //   );
  // }

  getItems() {
    return this.http.get<Item[]>(`https://${LOCALHOST}:3000/api/item/items`)
    .pipe(tap(resDta => {
      this._items.next(resDta);
    }));
  }

  getItem(id: string) {
    return this.http.get<Item>(`https://${LOCALHOST}:3000/api/item/item/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addItem(item: Item) {
    return this.http.post<{id: string}>(`https://${LOCALHOST}:3000/api/item/item`,
    {
      ...item
    }).
    pipe(
      switchMap(resData => {
        item.id = resData.id;
        return this.items;
      }),
      take(1),
      switchMap(items => {
        this._items.next(items.concat(item));
        return this.getItem(item.id);
      }));
  }

  updateItem(item: Item) {
    const itemObj = {
       productId:     item.productId,
       name:          item.name,
       description:   item.description,
       price:         item.price,
       thumbnail:     item.thumbnail,
       catalogNumber: item.catalogNumber,
       quantity:      item.quantity,
       country:       item.category
      };
    return this.http.put<Item>(`https://${LOCALHOST}:3000/api/item/item/${item.id}`,
    {
      ...itemObj
    }).
    pipe(tap(updatedItem => {
        this.getItems();
        return updatedItem;
      }));
  }

  deleteItem(id: string) {
    return this.http.delete(`https://${LOCALHOST}:3000/api/item/item/${id}`).
    pipe(
      switchMap(resData => {
        return this.getItems();
      }),
      tap(items => {
        this._items.next(items.filter(i => i.id !== id));
      }));
  }

  uploadItemThumbnail(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      `https://${LOCALHOST}:3000/api/image/uploadItemImage`,
      uploadData
    );
  }

}
