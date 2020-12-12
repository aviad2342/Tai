import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from './store.service';
import { CartItem, Item } from './item.model';
import { AppService } from '../app.service';
import { ItemService } from './item.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.model';
import { Customer } from '../customer/customer.model';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit, OnDestroy {

  items: Item[];
  cartItems: CartItem[] = [];
  itemsAddedToCart = 0;
  user: User;
  cart: Cart;
  customer: Customer;
  isLoading = false;
  private itemsSubscription: Subscription;
  isDesktop: boolean;
  // categories = ['ספרים', 'הרצאות', 'אביזרים', 'אחר'];
  categories = [
    'ספרים',
    'טיפולים',
    'כנסים',
    'קורסים',
    'מאמרים',
    'אביזרים',
    'אחר'
  ];

  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true,
    breakpoints: {
      150: {
        slidesPerView: 1,
        spaceBetween: 100
      },
      180: {
        slidesPerView: 1,
        spaceBetween: 100
      },
      200: {
        slidesPerView: 1,
        spaceBetween: 100
      },
      250: {
        slidesPerView: 1,
        spaceBetween: 100
      },
      320: {
        slidesPerView: 1.6,
        spaceBetween: 100
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      650: {
        slidesPerView: 3,
        spaceBetween: 10
      },
      750: {
        slidesPerView: 3,
        spaceBetween: 10
      },
      1080: {
        slidesPerView: 5,
        spaceBetween: 3,
        initialSlide: 1
      }
    }
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private appService: AppService,
    private itemService: ItemService
    ) { }

  ngOnInit() {
    this.itemsSubscription = this.itemService.items.subscribe(items => {
      this.items = items;
    });
    console.log(this.authService.getLoggedUserId());
        this.cartService.getCustomerCart(this.authService.getLoggedUserId()).subscribe(cart => {
      if(cart) {
        this.cart = cart;
        this.cartItems = cart.items;
        this.itemsAddedToCart = cart.items.length;
      } else {
        this.authService.getUserLogged().subscribe(user => {
          this.cart = new Cart(null, user, [], null);
        });
      }
    });
  }

  onItemAddedToCart(item: Item) {
    const cartItem: CartItem = item;
    cartItem.units = 1;
    if(this.cart.id !== null) {
    cartItem.cart = this.cart.id;
    this.cartService.addCartItem(cartItem).subscribe(() => {
      this.cart.items.push(cartItem);
      this.itemsAddedToCart = this.cart.items.length;
      this.appService.presentToast('הפריט נשמר בהצלחה', true);
    }, error => {
      this.appService.presentToast('חלה תקלה לא ניתן להוסיף את המוצר! נסה שנית מאוחר יותר', false);
    });
  } else {
      this.cart.items.push(cartItem);
      this.itemsAddedToCart = this.cart.items.length;
      this.appService.presentToast('הפריט נשמר בהצלחה', true);
  }
  }

  onGoToCart() {
    if(this.cart.id === null) {
      this.cartService.addCart(this.cart).subscribe(newCart => {
        this.router.navigate(['/', 'cart', newCart.id]);
      });
    } else {
      this.router.navigate(['/', 'cart', this.cart.id]);
    }
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.itemService.getItems().subscribe();
  }
  getItemByCategory(category: string) {
    const items = this.items.filter(p => p.category === category).slice();
    return items;
  }

  itemExistInCart(item: Item) {
    return this?.cartItems.map(cartItem => cartItem.id).includes(item.id);
  }

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }

}
