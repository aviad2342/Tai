import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { OrderItem } from '../store/item.model';
import { Order } from './order.model';

const LOCALHOST = 'localhost';

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
      return this.http.get<Order[]>(`http://${LOCALHOST}:3000/api/order/orders`)
      .pipe(tap(resDta => {
        this._orders.next(resDta);
      }));
    }

    getOrder(id: string) {
      return this.http.get<Order>(`http://${LOCALHOST}:3000/api/order/order/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    getOrderItems(id: string) {
      return this.http.get<OrderItem[]>(`http://${LOCALHOST}:3000/api/order/order/items/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    addOrder(order: Order) {
      return this.http.post<Order>(`http://${LOCALHOST}:3000/api/order/order`,
      {
        ...order
      }).
      pipe(tap(newOrder => {
        return newOrder;
      }));
    }

    updateOrder(order: Order) {
      const orderObj = {
        cartId:               order.cartId,
        date:                 order.date,
        note:                 order.note,
        delivery:             order.delivery,
        couponCode:           order.couponCode,
        totalItems:           order.totalItems,
        totalPayment:         order.totalPayment,
        receivedPayment:      order.receivedPayment,
        confirmPaymentNumber: order.confirmPaymentNumber,
        customer:             order.customer,
        address:              order.address,
        items:                order.items,
        };
      return this.http.put<Order>(`http://${LOCALHOST}:3000/api/order/order/${order.id}`,
      {
        ...orderObj
      }).
      pipe(tap(updatedOrder => {
          return updatedOrder;
        }));
    }

    deleteOrder(id: string) {
      return this.http.delete(`http://${LOCALHOST}:3000/api/order/order/${id}`).
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
          `http://${LOCALHOST}:3000/api/order/orders/customer/${customerId}`)
        .pipe(tap(orders => {
          return orders;
        }));
    }

    getOrdersByItem(itemId: string) {
      return this.http
        .get<Order[]>(
          `http://${LOCALHOST}:3000/api/order/orders/item/${itemId}`)
        .pipe(tap(orders => {
          return orders;
        }));
    }
}
