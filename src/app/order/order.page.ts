import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  order: Order;
  coupon: Coupon;
  address: DeliveryAddress = new DeliveryAddress();
  addressIsValid = false;
  openAddressPicker = false;
  discountRate  = 0;
  discount = 0.000;
  summaryItems = 0;
  isLoading = false;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private couponService: CouponService,
    private orderService: OrderService,
    private authService: AuthService,
    public appService: AppService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.router.navigate(['/tabs/store']);
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
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את ההזמנה.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/tabs/store']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  onAddressPicked(address: DeliveryAddress) {
    this.address = address;
  }

  onAddressIsValid(isValid: boolean) {
    this.addressIsValid = isValid;
  }

  onToggleAddressPicker() {
    this.openAddressPicker  = this.openAddressPicker ? false : true;
  }

  updateTotalOrder() {
    this.order.totalPayment = (this.order.totalItems + this.order.delivery) - this.discount;
  }

}
