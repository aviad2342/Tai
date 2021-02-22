import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, NavController } from '@ionic/angular';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { DeliveryAddress } from '../shared/address.model';
import { Coupon } from '../store/coupon.model';
import { CouponService } from '../store/coupon.service';
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
    public appService: AppService,
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
    if (!form.valid || !this.addressIsValid) {
      return;
    }
    // console.log(new Date(form.value.cardYear).getFullYear().toString());
    // console.log((new Date(form.value.cardMonth).getMonth() + 1).toString());
    const orderToUpdate = new Order(
      this.order.id,
      this.order.cartId,
      new Date(),
      '',
      this.order.delivery,
      this.order.couponCode,
      this.order.totalItems,
      this.order.totalPayment,
      false,
      'a3nf4jd6',
      this.order.customer,
      this.address,
      this.order.items
    );
    this.orderService.updateOrder(orderToUpdate).subscribe(() => {
      this.cartService.deleteCart(this.order.cartId).subscribe();
      this.appService.presentToast('ההזמנה בוצעה בהצלחה', true);
      this.router.navigate(['/tabs/store']);
    },
    error => {
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
