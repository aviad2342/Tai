import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { CartItem } from '../store/item.model';
import { Cart } from './cart.model';

const LOCALHOST = 'localhost';

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
      return this.http.get<Cart>(`http://${LOCALHOST}:3000/api/cart/cart/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    getCustomerCart(id: string) {
      return this.http.get<Cart>(`http://${LOCALHOST}:3000/api/cart/cart/customer/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    isItemInCart(customerId: string, itemId: string) {
      return this.http.get<boolean>(`http://${LOCALHOST}:3000/api/cart/items/${customerId}/${itemId}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    addCart(cart: Cart) {
      return this.http.post<{id: string}>(`http://${LOCALHOST}:3000/api/cart/cart`,
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

    addCartItem(item: CartItem) {
      return this.http.post<{id: string}>(`http://${LOCALHOST}:3000/api/cart/item`,
      {
        ...item
      }).
      pipe(tap(resData => {
        item.id = resData.id;
          return item;
        }));
    }

    updateCart(cart: Cart) {
      const cartObj = {
        customer: cart.customer,
        items:    cart.items,
        orderId: cart.orderId,
        };
      return this.http.put<Cart>(`http://${LOCALHOST}:3000/api/cart/cart/${cart.id}`,
      {
        ...cartObj
      }).
      pipe(tap(updatedCart => {
        this._cart.next(updatedCart);
          return updatedCart;
        }));
    }

    updateCartItem(item: CartItem) {
      const cartItemObj = {
        productId:     item.productId,
        name:          item.name,
        description:   item.description,
        price:         item.price,
        thumbnail:     item.thumbnail,
        catalogNumber: item.catalogNumber,
        quantity:      item.quantity,
        country:       item.category,
        itemId:        item.itemId,
        units:         item.units
       };
      return this.http.put<CartItem>(`http://${LOCALHOST}:3000/api/cart/item/${item.id}`,
      {
        ...cartItemObj
      }).
      pipe(tap(updatedCartItem => {
          return updatedCartItem;
        }));
    }

    deleteCart(id: string) {
      return this.http.delete(`http://${LOCALHOST}:3000/api/cart/cart/${id}`).
      pipe(
        tap(resData => {
          return resData;
        }));
    }

    deleteCartItem(id: string) {
      return this.http.delete(`http://${LOCALHOST}:3000/api/cart/item/${id}`).
      pipe(
        tap(resData => {
          return resData;
        }));
    }
}
