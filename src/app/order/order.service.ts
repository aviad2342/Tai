import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    // tslint:disable-next-line: variable-name
    private _orders = new BehaviorSubject<Order[]>([]);


    get orders() {
      return this._orders.asObservable();
    }

    constructor( private http: HttpClient ) { }

    getOrders() {
      return this.http.get<Order[]>('http://localhost:3000/api/order/orders')
      .pipe(tap(resDta => {
        this._orders.next(resDta);
      }));
    }

    getOrder(id: string) {
      return this.http.get<Order>(`http://localhost:3000/api/order/order/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    addOrder(order: Order) {
      return this.http.post<{id: string}>('http://localhost:3000/api/order/order',
      {
        ...order
      }).
      pipe(
        switchMap(resData => {
          order.id = resData.id;
          return this.orders;
        }),
        take(1),
        switchMap(orders => {
          this._orders.next(orders.concat(order));
          return this.getOrder(order.id);
        }));
    }

    updateOrder(order: Order) {
      const orderObj = {
        date:            order.date,
        note:            order.note,
        totalPayment:    order.totalPayment,
        receivedPayment: order.receivedPayment,
        customer:        order.customer,
        address:        order.address,
        items:           order.items,
        };
      return this.http.put<Order>(`http://localhost:3000/api/order/order/${order.id}`,
      {
        ...orderObj
      }).
      pipe(tap(updatedItem => {
          this.getOrders();
          return updatedItem;
        }));
    }

    deleteOrder(id: string) {
      return this.http.delete(`http://localhost:3000/api/order/order/${id}`).
      pipe(
        switchMap(resData => {
          return this.getOrders();
        }),
        tap(orders => {
          this._orders.next(orders.filter(o => o.id !== id));
        }));
    }

    getOrdersByCustomer(customerId: string) {
      return this.http
        .get<Order[]>(
          `http://localhost:3000/api/order/orders/customer/${customerId}`)
        .pipe(tap(orders => {
          return orders;
        }));
    }

    getOrdersByItem(itemId: string) {
      return this.http
        .get<Order[]>(
          `http://localhost:3000/api/order/orders/item/${itemId}`)
        .pipe(tap(orders => {
          return orders;
        }));
    }
}
