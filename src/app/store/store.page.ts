import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem, Item } from './item.model';
import { AppService } from '../app.service';
import { ItemService } from './item.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.model';
import { Customer } from '../customer/customer.model';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart.model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

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
  categories: string[] = [];
  // categories = [
  //   'ספרים',
  //   'טיפולים',
  //   'כנסים',
  //   'קורסים',
  //   'מאמרים',
  //   'אביזרים',
  //   'אחר'
  // ];

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
        spaceBetween: 50
      },
      650: {
        slidesPerView: 3,
        spaceBetween: 70
      },
      750: {
        slidesPerView: 3,
        spaceBetween: 70
      },
      1080: {
        slidesPerView: 5,
        spaceBetween: 100
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
      this.categories = this.items.map(item => item.category).filter((value, index, self) => self.indexOf(value) === index);
    });
    this.cartService.getCustomerCart(this.authService.getLoggedUserId()).subscribe(cart => {
      if(cart) {
        this.cart = cart;
        this.cartItems = cart.items;
        this.itemsAddedToCart = cart.items.length;
      } else {
        this.authService.getUserLogged().pipe(
          switchMap(user => {
          const newCart = new Cart(null, user, this.cartItems, null);
          return this.cartService.addCart(newCart);
        })).subscribe(newCart => {
          this.cart = newCart;
        });
      }
    });
  }


  onItemAddedToCart(item: Item) {
    const cartItem: CartItem = item;
    cartItem.itemId = item.id;
    cartItem.units = 1;
    cartItem.cart = this.cart.id;
    this.cartService.addCartItem(cartItem).subscribe(() => {
      this.cart.items.push(cartItem);
      this.itemsAddedToCart = this.cart.items.length;
      this.appService.presentToast('הפריט נשמר בהצלחה', true);
    }, error => {
      this.appService.presentToast('חלה תקלה לא ניתן להוסיף את המוצר! נסה שנית מאוחר יותר', false);
    });
  }

  onGoToCart() {
    this.router.navigate(['/', 'cart', this.cart.id]);
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.itemService.getItems().subscribe();
  }

  // ionViewDidLeave() {
  //   if (this.itemsSubscription) {
  //     this.itemsSubscription.unsubscribe();
  //   }
  //   this.router.dispose();
  // }

  getItemByCategory(category: string) {
    return this.items.filter(p => p.category === category).slice();
  }

  itemExistInCart(id: string) {
    // let bool: boolean;
    // console.log(this?.cartItems.map(cartItem => cartItem.itemId).find(i => i === id));
    // const ll = this.cartItems.find(i => i.itemId === id);
    // bool = this?.cartItems.map(cartItem => cartItem.itemId).indexOf(id) > -1;
    // console.log(id);
    // console.log(bool);
    // console.log(this?.cartItems.map(cartItem => cartItem.itemId).indexOf(id));
    // return bool;
    // console.log(this?.cartItems.map(cartItem => cartItem.itemId));
    // return this.cartItems.filter(i => i.itemId === item.id).length > 0;
    // return this?.cartItems.map(cartItem => cartItem.itemId).includes(item.id);
  }

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }

}
