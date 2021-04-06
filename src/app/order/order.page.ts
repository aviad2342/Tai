import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { Customer } from '../customer/customer.model';
import { CustomerService } from '../customer/customer.service';
import { DeliveryAddress } from '../shared/address.model';
import { Coupon } from '../store/coupon.model';
import { CouponService } from '../store/coupon.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { CreditCard } from './credit-card.model';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('hidden => shown', animate('0.1s ease-in')),
      transition('shown => hidden', animate('0.1s ease-out'))
    ])
  ],
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  order: Order;
  activeUrl = '';
  coupon: Coupon;
  user: User
  customer: Customer;
  address: DeliveryAddress = new DeliveryAddress();
  @ViewChild('f', { static: true }) form: NgForm;
  addressIsValid = false;
  openOrderDetails = true;
  openAddressPicker = true;
  openPaymentDetails = true;
  saveDeliveryAddress = false;
  isFormValid = false;
  discountRate  = 0;
  discount = 0.000;
  summaryItems = 0;
  isLoading = false;
  addressPickerState = 'shown';
  paymentDetailsState = 'shown';
  orderDetailsState = 'shown';
  now = new Date().toISOString();

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    private couponService: CouponService,
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService,
    public appService: AppService,
    private customerService: CustomerService,
    public animationController: AnimationController
  ) {}

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/store');
        return;
      }
      this.orderService.getOrder(paramMap.get('id')).subscribe(order => {
            this.order = order;
            if(order.couponCode.length > 0) {
              this.couponService.getCoupon(order.couponCode).subscribe(coupon => {
                this.coupon = coupon;
                this.discountRate = (coupon.discount/100);
                if(coupon.singleItem) {
                  this.discount = (this.order.items.find(i => i.productId === coupon.itemId).price * this.discountRate);
                  this.updateTotalOrder();
                  this.isLoading = false;
                } else {
                  this.discount = ((this.order.totalItems + this.order.delivery) * this.discountRate);
                  this.updateTotalOrder();
                  this.isLoading = false;
                }
              });
            } else {
              this.updateTotalOrder();
              this.isLoading = false;
            }
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את ההזמנה.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/tabs/store');
                      }
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
            }
          }
        );
    });
    this.userService.getUser(this.authService.getLoggedUserId()).subscribe(user => {
      this.customer = user;
      console.log(this.customer);
     });
  }

  async onFormValid(valid: boolean) {
     this.isFormValid = await valid;
  }

  onAddressPicked(address: DeliveryAddress) {
    this.address = address;
  }

  onAddressIsValid(isValid: boolean) {
    console.log(isValid);
    this.addressIsValid = isValid;
  }

  onToggleOrderDetails() {
    // this.openAddressPicker  = this.openAddressPicker ? false : true;
    this.openOrderDetails  = !this.openOrderDetails;
    this.orderDetailsState = this.openOrderDetails ? 'shown' : 'hidden';
  }

  onToggleAddressPicker() {
    // this.openAddressPicker  = this.openAddressPicker ? false : true;
    this.openAddressPicker  = !this.openAddressPicker;
    this.addressPickerState = this.openAddressPicker ? 'shown' : 'hidden';
  }

  onTogglePaymentDetails() {
    // this.openAddressPicker  = this.openAddressPicker ? false : true;
    this.openPaymentDetails  = !this.openPaymentDetails;
    this.paymentDetailsState = this.openPaymentDetails ? 'shown' : 'hidden';
  }

  onSaveOrder() {
    this.onSubmit(this.form);
  }

  onSubmit(form: NgForm) {
    // if (!form.valid || !this.addressIsValid) {
    //   return;
    // }

    if (!form.valid) {
      return;
    }
    const payment = new CreditCard(
      form.value.cardNumber,
      form.value.ownerId,
      form.value.ownerName,
      form.value.expirationDate,
      form.value.cvv,
      this.order.totalPayment
    );

    this.orderService.commitPayment(payment).pipe(
      switchMap(confirmPaymentNumber => {
        const order = new Order(
          this.order.id,
          this.order.cartId,
          new Date(),
          '',
          this.order.delivery,
          this.order.couponCode,
          this.order.totalItems,
          this.order.totalPayment,
          false,
          confirmPaymentNumber,
          this.address,
          this.user,
          this.order.items
        );
        if(this.customer.orders) {
          this.customer.orders.push(order);
          return this.customerService.updateCustomer(this.customer);
        } else {
          const orders: Order[] = [];
          orders.push(order);
          const newCustomer: Customer = new Customer(
            this.customer.id,
            this.customer.firstName,
            this.customer.lastName,
            this.customer.password,
            this.customer.phone,
            this.customer.email,
            this.customer.date,
            this.customer.profilePicture,
            this.customer.address,
            this.customer.preferences,
            this.customer.savedVideos,
            this.customer.cart,
            this.customer.orders
          );
          return this.customerService.updateCustomer(newCustomer);
        }
      })
    ).subscribe(() => {
      this.cartService.deleteCart(this.order.cartId).subscribe();
      this.appService.presentToast('ההזמנה בוצעה בהצלחה', true);
      this.router.navigate(['/tabs/store']);
    },
    error => {
      console.log(error);
      this.appService.presentToast('לא ניתן להשלים את ההזמנה כעת, אנא נסה מאוחר יותר.', false);
    });

  }

  updateTotalOrder() {
    this.order.totalPayment = (this.order.totalItems + this.order.delivery) - this.discount;
  }

  getDeliveryAddress() {
    if(this.order.address) {
      return this.order.address?.street + ' ' +
      this.order.address?.houseNumber + ', ' +
      this.order.address?.city + ', ' +
      this.order.address?.country;
    }
  }

}
