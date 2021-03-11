import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Testimony } from './testimony.model';

const LOCALHOST = environment.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class TestimonyService {

  // tslint:disable-next-line: variable-name
  private _testimonies = new BehaviorSubject<Testimony[]>([]);

  get testimonies() {
    return this._testimonies.asObservable();
  }

  constructor( private http: HttpClient ) { }

  getAllTestimonies() {
    return this.testimonies
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  getTestimonies() {
    return this.http.get<Testimony[]>(`http://${LOCALHOST}:3000/api/testimony/testimonies`)
    .pipe(tap(resDta => {
      this._testimonies.next(resDta);
    }));
  }

  getTestimony(id: string) {
    return this.http.get<Testimony>(`http://${LOCALHOST}:3000/api/testimony/testimony/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addTestimony(testimony: Testimony) {
    return this.http.post<Testimony>(`http://${LOCALHOST}:3000/api/testimony/testimony`,
    {
      ...testimony
    }).
    pipe(
      switchMap(resData => {
        testimony.id = resData.id;
        return this.testimonies;
      }),
      take(1),
      tap(testimonies => {
        this._testimonies.next(testimonies.concat(testimony));
      }));
  }


  updateTestimony(testimony: Testimony) {
    const testimonyObj = {
      firstName: testimony.firstName,
      lastName:  testimony.lastName,
      date:      testimony.date,
      content:   testimony.content,
      picture:   testimony.picture,
      approved:  testimony.approved
      };
    return this.http.put<Testimony>(`http://${LOCALHOST}:3000/api/testimony/testimony/${testimony.id}`,
    {
      ...testimonyObj
    }).
    pipe(
      switchMap(resData => {
        return this.getTestimonies();
      }),
      switchMap(testimonies => {
        this._testimonies.next(testimonies);
        return testimonies.filter(t => t.id === testimony.id);
      }),
      take(1),
      tap(testimonyData => {
        return testimonyData;
      }));
  }

  deleteTestimony(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/testimony/testimony/${id}`).
    pipe(
      switchMap(resData => {
        return this.getTestimonies();
      }),
      tap(testimonies => {
        this._testimonies.next(testimonies.filter(t => t.id !== id));
      }));
  }

  uploadImage(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      `http://${LOCALHOST}:3000/api/image/uploadTestimonyImage`,
      uploadData
    );
  }

}
