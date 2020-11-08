import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Cart } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    // tslint:disable-next-line: variable-name
    private _cart = new BehaviorSubject<Cart>(null);


    get cart() {
      return this._cart.asObservable();
    }

    constructor( private http: HttpClient ) { }

    getCart(id: string) {
      return this.http.get<Cart>(`http://localhost:3000/api/cart/cart/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    getCustomerCart(id: string) {
      return this.http.get<Cart>(`http://localhost:3000/api/cart/cart/customer/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    addCart(cart: Cart) {
      return this.http.post<{id: string}>('http://localhost:3000/api/cart/cart',
      {
        ...cart
      }).
      pipe(
        switchMap(resData => {
          return this.getCart(resData.id);
        }),
        take(1),
        switchMap(newCart => {
          this._cart.next(newCart);
          return this._cart;
        }));
    }

    updateCart(cart: Cart) {
      const cartObj = {
        customer: cart.customer,
        items:    cart.items
        };
      return this.http.put<Cart>(`http://localhost:3000/api/cart/cart/${cart.id}`,
      {
        ...cartObj
      }).
      pipe(tap(updatedCart => {
        this._cart.next(updatedCart);
          return updatedCart;
        }));
    }

    deleteCart(id: string) {
      return this.http.delete(`http://localhost:3000/api/cart/cart/${id}`).
      pipe(
        tap(resData => {
          return resData;
        }));
    }
}
