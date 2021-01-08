import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Customer } from './customer.model';

const LOCALHOST = '10.0.0.1';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    // tslint:disable-next-line: variable-name
    private _customers = new BehaviorSubject<Customer[]>([]);

    get customers() {
      return this._customers.asObservable();
    }

    constructor( private http: HttpClient ) { }

    getCustomers() {
      return this.http.get<Customer[]>(`http://${LOCALHOST}:3000/api/customer/customers`)
      .pipe(tap(resDta => {
        this._customers.next(resDta);
      }));
    }

    getCustomer(id: string) {
      return this.http.get<Customer>(`http://${LOCALHOST}:3000/api/customer/customer/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    getCustomerByEmail(email: string) {
      return this.http
        .get<Customer>(
          `http://${LOCALHOST}:3000/api/customer/customer/email/${email}`)
        .pipe(tap(customer => {
          return customer;
        }));
    }

    uploadImage(image: File, fileName: string) {
      const uploadData = new FormData();
      uploadData.append('image', image, fileName);
      return this.http.post<{ imageUrl: string}>(
        `http://${LOCALHOST}:3000/api/image/upload`,
        uploadData
      );
    }

    addCustomer(customer: Customer) {
      return this.http.post<{id: string}>(`http://${LOCALHOST}:3000/api/customer/customer`,
      {
        ...customer
      }).
      pipe(
        switchMap(resData => {
          customer.id = resData.id;
          return this.customers;
        }),
        take(1),
        tap(customers => {
          this._customers.next(customers.concat(customer));
        }));
    }

    updateCustomer(customer: Customer) {
      const customerObj = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        password: customer.password,
        date: customer.date,
        country: customer.country,
        city: customer.city,
        street: customer.street,
        houseNumber: customer.houseNumber,
        apartment: customer.apartment,
        entry: customer.entry,
        profilePicture: customer.profilePicture,
        orders: customer.orders
        };
      return this.http.put(`http://${LOCALHOST}:3000/api/customer/customer/${customer.id}`,
      {
        ...customerObj
      }).
      pipe(
        switchMap(resData => {
          return this.getCustomers();
        }),
        switchMap(customers => {
          this._customers.next(customers);
          return customers.filter(c => c.id === customer.id);
        }),
        take(1),
        tap(customerData => {
          return customerData;
        }));
    }

    deleteCustomer(id: string) {
      return this.http.delete(`http://${LOCALHOST}:3000/api/customer/customer/${id}`).
      pipe(
        switchMap(resData => {
          return this.getCustomers();
        }),
        tap(customers => {
          this._customers.next(customers.filter(c => c.id !== id));
        }));
    }
}
