import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Update } from './update.model';

const LOCALHOST = environment.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

    // tslint:disable-next-line: variable-name
    private _updates = new BehaviorSubject<Update[]>([
      new Update('1', '', 'קורס חדש בנושא: אמא שלך', new Date(), new Date(), 'url', true),
      new Update('2', '', 'קורס חדש בנושא: אבא שלך', new Date(), new Date(), 'url', true),
      new Update('3', '', 'קורס חדש בנושא: דוד שלך', new Date(), new Date(), 'url', true),
      new Update('4', '', 'קורס חדש בנושא: דודה שלך', new Date(), new Date(), 'url', true)
    ]);
    // countries: string[] = [];

    get updates() {
      return this._updates.asObservable();
    }

  constructor( private http: HttpClient ) { }

  getAllUpdates() {
    return this.updates.pipe(
      map (updates => {
        return updates;
      })
    );
  }

  getUpdates() {
    return this.http.get<Update[]>(`http://${LOCALHOST}:3000/api/update/updates`)
    .pipe(tap(resDta => {
      this._updates.next(resDta);
    }));
  }

  getUpdate(id: string) {
    return this.http.get<Update>(`http://${LOCALHOST}:3000/api/update/update/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addUpdate(update: Update) {
    return this.http.post<Update>(`http://${LOCALHOST}:3000/api/update/update`,
    {
      ...update
    }).
    pipe(
      switchMap(resData => {
        update.id = resData.id;
        return this.updates;
      }),
      take(1),
      tap(updates => {
        this._updates.next(updates.concat(update));
      }));
  }


  updateUpdate(update: Update) {
    const updateObj = {
      updateType:  update.updateType,
      description: update.description,
      date:        update.date,
      endUpdate:   update.endUpdate,
      url:         update.url,
      active:      update.active,
      productId:   update.productId
      };
    return this.http.put<Update>(`http://${LOCALHOST}:3000/api/update/update/${update.id}`,
    {
      ...updateObj
    }).
    pipe(
      switchMap(resData => {
        return this.getUpdates();
      }),
      switchMap(updates => {
        // this._updates.next(updates);
        return updates.filter(u => u.id === update.id);
      }),
      take(1),
      tap(updateData => {
        return updateData;
      }));
  }

  deleteUpdate(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/update/update/${id}`).
    pipe(
      switchMap(resData => {
        return this.getUpdates();
      }),
      tap(updates => {
        this._updates.next(updates.filter(u => u.id !== id));
      }));
  }

}
