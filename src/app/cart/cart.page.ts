import { DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonItemSliding, NavController } from '@ionic/angular';
import { range } from 'rxjs';
import { AppService } from '../app.service';
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
  bla: HTMLAllCollection;
  summaryItems = 0;
  shippingCost = 0;
  couponCode = '';
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
    public appService: AppService
  ) {}

  ngOnInit() {
    console.log(this.units);
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
                message: 'לא ניתן להציג את המוצר.',
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
  onk() {
    return;
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
    console.log(this.couponCode);
    this.discountRate = (30/100);
    this.discount = (this.cart.items[0].price * this.discountRate);
    this.haveDiscount = true;
    this.updateTotalOrder();
  }

  onEditItems() {

  }

  onDoneAdding() {}

  updateTotalOrder() {
    this.summaryItems = this.cart.items.reduce((sum, current) => {
      return sum + (current.price * current.units);
    }, 0);

    this.summaryOrder = (this.summaryItems + this.shippingCost) - this.discount;
  }

}
