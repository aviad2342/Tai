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
  private _testimonies = new BehaviorSubject<Testimony[]>([
    new Testimony('1','אביעד', 'בן חיון', new Date('9-10-2021'), 'היום היו הרבה בחורות בים.', 'http://aviadbenhayun.com:3000/images/aviad2342@walla.com.jpg'),
    new Testimony('2','אבריל', 'ליון', new Date('9-10-2021'), 'הפסימי מתלונן על הרוח, האופטימי מצפה שהיא תשתנה, החכם מכוון את המפרש בהתאם', 'http://aviadbenhayun.com:3000/therapistImages/1611841244314@avrill.jpg'),
    new Testimony('3','שירן', 'גרמן', new Date('10-10-2021'), 'אל תתפללו לחיים קלים יותר, וודאו שאתם נעשים חזקים יותר', 'http://aviadbenhayun.com:3000/images/shiran.german@gmail.com.jpg'),
    new Testimony('4','מור', 'שמעוני', new Date('10-10-2021'), 'יש רק שתי דרכים לחיות, אחת היא לחשוב ששום דבר אינו קסום, השניה היא לחשוב שהכל קסום', 'http://aviadbenhayun.com:3000/images/tw.spider@gmail.com.jpg')
  ]);

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
    return this.http.get<Testimony[]>(`http://${LOCALHOST}:3000/api/coupon/coupons`)
    .pipe(tap(resDta => {
      this._testimonies.next(resDta);
    }));
  }

  getTestimony(id: string) {
    return this.http.get<Testimony>(`http://${LOCALHOST}:3000/api/coupon/coupon/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addTestimony(testimony: Testimony) {
    return this.http.post<Testimony>(`http://${LOCALHOST}:3000/api/coupon/coupon`,
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
      picture:   testimony.picture
      };
    return this.http.put<Testimony>(`http://${LOCALHOST}:3000/api/coupon/coupon/${testimony.id}`,
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

  deleteCoupon(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/coupon/coupon/${id}`).
    pipe(
      switchMap(resData => {
        return this.getTestimonies();
      }),
      tap(testimonies => {
        this._testimonies.next(testimonies.filter(t => t.id !== id));
      }));
  }
}
