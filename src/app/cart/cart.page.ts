import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonItemSliding, NavController } from '@ionic/angular';
import { range } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { Order } from '../order/order.model';
import { OrderService } from '../order/order.service';
import { Coupon } from '../store/coupon.model';
import { CouponService } from '../store/coupon.service';
import { CartItem } from '../store/item.model';
import { Cart } from './cart.model';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cart: Cart;
  isLoading = false;
  @ViewChild('slidingItem') slidingItem: IonItemSliding;
  slidingItems: IonItemSliding[] = [];
  coupon: Coupon;
  summaryItems = 0;
  shippingCost = 0;
  couponCode = '';
  orderCouponCode = '';
  discountRate  = 0;
  discount = 0.000;
  summaryOrder = 0;
  haveDiscount = false;
  units: number[] = [1,2,3,4,5,6,7,8,9,10];
  itemUnitsSelectOptions = {
    cssClass: 'select-units-style',
  };

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
      this.cartService.getCart(paramMap.get('id')).subscribe(cart => {
            this.cart = cart;
            this.isLoading = false;
            this.updateTotalOrder();
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את העגלה.',
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

  onItemQuantityChange(num: number, item: CartItem) {
    item.units = num;
    this.cartService.updateCartItem(item).subscribe(() => {
      this.updateTotalOrder();
    });
  }

  onRemoveItem(item: CartItem) {
    this.cartService.deleteCartItem(item.id).subscribe(() => {
      this.cart.items.splice(this.cart.items.indexOf(item), 1);
    this.updateTotalOrder();
    }, error => {
      this.appService.presentToast('חלה תקלה לא ניתן למחוק את המוצר! נסה שנית מאוחר יותר', false);
    });
  }

  onAddCoupon() {
    this.couponService.getCoupon(this.couponCode).subscribe(coupon => {
      if(coupon) {
        this.coupon = coupon;
        if(coupon.customers.includes(this.authService.getLoggedUserId())) {
          this.appService.presentToast('הקופון נוצל בעבר!', false);
          this.couponCode = '';
          return;
        }
        if(coupon.expirationDate < new Date()) {
          this.appService.presentToast('פג תוקופו של קופון זה!', false);
          this.couponCode = '';
          return;
        }
        if(coupon.singleItem) {
          this.discountRate = (coupon.discount/100);
          if(!this.cart.items.find(i => i.productId === coupon.itemId)) {
            this.appService.presentToast('קופון זה אינו תואם למוצרים בעגלה!', false);
            this.couponCode = '';
            return;
          }
          this.discount = (this.cart.items.find(i => i.productId === coupon.itemId).price * this.discountRate);
          this.haveDiscount = true;
          this.updateTotalOrder();
          this.appService.presentToast('הקופון נוסף בהצלחה', true);
          this.orderCouponCode = this.couponCode;
          this.couponCode = '';
        } else {
          this.discountRate = (coupon.discount/100);
          this.discount = (this.summaryOrder * this.discountRate);
          this.haveDiscount = true;
          this.updateTotalOrder();
          this.appService.presentToast('הקופון נוסף בהצלחה', true);
          this.orderCouponCode = this.couponCode;
          this.couponCode = '';
        }
      } else {
        this.appService.presentToast('קוד קופון שגוי!', false);
        this.couponCode = '';
          return;
      }
    }, error => {
      this.appService.presentToast('חלה תקלה לא ניתן לאמת את קוד הקפון כרגע. אנא נסו שנית מאוחר יותר.', false);
    });
  }

  onEditItems() {

  }

  onMoveToPayment() {
    if(this.cart.orderId && this.cart.orderId !== null && this.cart.orderId.length > 0 ) {
      this.orderService.getOrder(this.cart.orderId)
      .pipe(
        switchMap(order => {
        const orderToUpdate = new Order(
          order.id,
          order.cartId,
          new Date(),
          order.note,
          this.shippingCost,
          this.orderCouponCode,
          this.summaryOrder,
          order.receivedPayment,
          order.confirmPaymentNumber,
          order.customer,
          order.address,
          this.cart.items
        );
        return this.orderService.updateOrder(orderToUpdate);
      })).subscribe(updateedOrder => {
        this.router.navigate(['/', 'order', updateedOrder.id]);
      }, error => {
        this.appService.presentToast('חלה תקלה לא ניתן לבצע את ההזמנה כרגע. אנא נסו שנית מאוחר יותר.', false);
      });
    } else {
      const newOrder = new Order(
        null,
        this.cart.id,
        new Date(),
        '',
        this.shippingCost,
        this.orderCouponCode,
        this.summaryOrder,
        false,
        '',
        this.cart.customer,
        null,
        this.cart.items
      );
      this.orderService.addOrder(newOrder).subscribe(order => {
        this.router.navigate(['/', 'order', order.id]);
      }, error => {
        this.appService.presentToast('חלה תקלה לא ניתן לבצע את ההזמנה כרגע. אנא נסו שנית מאוחר יותר.', false);
      });
    }
  }

  updateTotalOrder() {
    this.summaryItems = this.cart.items.reduce((sum, current) => {
      return sum + (current.price * current.units);
    }, 0);

    this.summaryOrder = (this.summaryItems + this.shippingCost) - this.discount;
  }

}
