import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, take, tap } from 'rxjs/operators';
import { Coupon } from './coupon.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor( private http: HttpClient ) { }


  getCoupons() {
    return this.http.get<Coupon[]>('http://localhost:3000/api/coupon/coupons')
    .pipe(tap(coupons => {
      return coupons;
    }));
  }

  getCoupon(id: string) {
    return this.http.get<Coupon>(`http://localhost:3000/api/coupon/coupon/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  getCustomerCoupons(id: string) {
    return this.http.get<Coupon[]>(`http://localhost:3000/api/coupon/coupons/${id}`)
    .pipe(tap(coupons => {
      return coupons;
    }));
  }

  addCoupon(coupon: Coupon) {
    return this.http.post<Coupon>('http://localhost:3000/api/coupon/coupon',
    {
      ...coupon
    }).
    pipe(tap(newCoupon => {
      return newCoupon;
    }));
  }

  updateCoupon(coupon: Coupon) {
    const couponObj = {
       code:           coupon.code,
       expirationDate: coupon.expirationDate,
       quantity:       coupon.quantity,
       singleItem:     coupon.singleItem,
       discount:       coupon.discount,
       itemId:         coupon.itemId,
       customers:      coupon.customers
      };
    return this.http.put<Coupon>(`http://localhost:3000/api/coupon/coupon/${coupon.code}`,
    {
      ...couponObj
    }).
    pipe(tap(updatedCoupon => {
        return updatedCoupon;
      }));
  }

  deleteCoupon(id: string) {
    return this.http.delete(`http://localhost:3000/api/coupon/coupon/${id}`).
    pipe(tap(resDta => {
      return resDta;
    }));
  }


}