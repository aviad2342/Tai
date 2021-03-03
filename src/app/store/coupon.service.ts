import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Coupon } from './coupon.model';
import { CouponUsers } from './couponUsers.model';

const LOCALHOST = environment.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  // tslint:disable-next-line: variable-name
  private _coupons = new BehaviorSubject<Coupon[]>([]);

  get coupons() {
    return this._coupons.asObservable();
  }

  constructor( private http: HttpClient ) { }


  getCoupons() {
    return this.http.get<Coupon[]>(`http://${LOCALHOST}:3000/api/coupon/coupons`)
    .pipe(tap(resDta => {
      this._coupons.next(resDta);
    }));
  }

  getCoupon(code: string) {
    return this.http.get<Coupon>(`http://${LOCALHOST}:3000/api/coupon/coupon/${code}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  getCustomerCoupons(id: string) {
    return this.http.get<CouponUsers[]>(`http://${LOCALHOST}:3000/api/coupon/coupons/${id}`)
    .pipe(tap(coupons => {
      return coupons;
    }));
  }

  addCoupon(coupon: Coupon) {
    return this.http.post<Coupon>(`http://${LOCALHOST}:3000/api/coupon/coupon`,
    {
      ...coupon
    }).
    pipe(
      switchMap(resData => {
        coupon.code = resData.code;
        return this.coupons;
      }),
      take(1),
      tap(coupons => {
        this._coupons.next(coupons.concat(coupon));
      }));
  }

  CouponUse(couponUser: CouponUsers) {
    return this.http.post<Coupon>(`http://${LOCALHOST}:3000/api/coupon/customer`,
    {
      ...couponUser
    }).
    pipe(
      tap(resData => {
        return resData
      }));
  }

  updateCoupon(coupon: Coupon) {
    const couponObj = {
       code:           coupon.code,
       date:           coupon.date,
       expirationDate: coupon.expirationDate,
       quantity:       coupon.quantity,
       singleItem:     coupon.singleItem,
       discount:       coupon.discount,
       itemId:         coupon.itemId
      };
    return this.http.put<Coupon>(`http://${LOCALHOST}:3000/api/coupon/coupon/${coupon.code}`,
    {
      ...couponObj
    }).
    pipe(
      switchMap(resData => {
        return this.getCoupons();
      }),
      switchMap(coupons => {
        this._coupons.next(coupons);
        return coupons.filter(c => c.code === coupon.code);
      }),
      take(1),
      tap(userData => {
        return userData;
      }));
  }

  deleteCoupon(code: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/coupon/coupon/${code}`).
    pipe(
      switchMap(resData => {
        return this.getCoupons();
      }),
      tap(coupons => {
        this._coupons.next(coupons.filter(c => c.code !== code));
      }));
  }


}
