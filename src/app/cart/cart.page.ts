import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { range } from 'rxjs';
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
  summaryItems = 20.99;
  shippingCost = 9.99;
  summaryOrder = 30.98;
  // units: number[] = Array.from(Array(11).keys());
  units: number[] = [1,2,3,4,5,6,7,8,9,10];
  itemUnitsSelectOptions = {
    cssClass: 'select-units-style',
  };

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController
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
    // const val = event.target.value;
    item.units = num;
  }

  onRemoveItem(item: CartItem) {
    this.cart.items.splice(this.cart.items.indexOf(item), 1);
  }

  onDoneAdding(){}

}
