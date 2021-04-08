import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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
import { NavController } from '@ionic/angular';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit, OnDestroy {

  items: Item[];
  cartItems: CartItem[];
  itemsAddedToCart = 0;
  user: User;
  cart: Cart;
  customer: Customer;
  isLoading = false;
  didAddItem = false;
  badgeColor = 'danger';
  private itemsSubscription: Subscription;
  private userSubscription: Subscription;
  isDesktop: boolean;
  categories: string[] = [];


  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets'
    },
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
        spaceBetween: 50
      },
      300: {
        slidesPerView: 1.4,
        spaceBetween: 50
      },
      380: {
        slidesPerView: 1.5,
        spaceBetween: 50
      },
      450: {
        slidesPerView: 2,
        spaceBetween: 50
      },
      510: {
        slidesPerView: 2,
        spaceBetween: 50
      },
      610: {
        slidesPerView: 2.5,
        spaceBetween: 50
      },
      700: {
        slidesPerView: 2.9,
        spaceBetween: 50
      },
      790: {
        slidesPerView: 3,
        spaceBetween: 50
      },
      850: {
        slidesPerView: 3,
        spaceBetween: 50
      },
      980: {
        slidesPerView: 3.2,
        spaceBetween: 50
      },
      1080: {
        slidesPerView: 5,
        spaceBetween: 50
      },
      1300: {
        slidesPerView: 5,
        spaceBetween: 50
      }
    }
  };

  constructor(
    private router: Router,
    private navController: NavController,
    private cartService: CartService,
    private authService: AuthService,
    private appService: AppService,
    private itemService: ItemService,
    private userService: UserService,
    private ngZone: NgZone
    ) { }

  ngOnInit() {
    this.isDesktop = this.appService.isDesktop();
    this.itemsSubscription = this.itemService.items.subscribe(items => {
      this.items = items;
      this.categories = items.map(item => item.category).filter((value, index, self) => self.indexOf(value) === index);
    });
    this.userSubscription = this.userService.user.subscribe(user => {
      this.user = user;
      if(user) {
        if(user.cart !== null && user.cart ) {
          this.cart = user.cart;
          if(user.cart.items) {
            this.itemsAddedToCart = user.cart.items.length;
            this.cartItems = user.cart.items;
          }
        } else {
          this.cartItems = [];
          this.cart = new Cart(
            null,
            this.cartItems,
            null
          );
          this.user.cart = this.cart;
          this.userService.updateFullUser(this.user).subscribe();
        }
      }
    });
  }

  ionViewWillEnter() {
    this.itemService.getItems().subscribe();
    this.userService.getFullUser(this.authService.getLoggedUserId()).subscribe();
  }


  onItemAddedToCart(item: Item) {
    this.didAddItem = true;
    this.badgeColor = 'success';
    setTimeout(()=>{
      this.didAddItem = false;
      this.badgeColor = 'danger';
    }, 3000)
    const cartItem: CartItem = new CartItem(
      null,
      item.productId,
      item.name,
      item.description,
      item.price,
      item.thumbnail,
      item.catalogNumber,
      item.quantity,
      item.category,
      item.id,
      1,
      this.user.cart.id
    );
    this.cartItems.push(cartItem);
    this.user.cart.items = this.cartItems;
    this.userService.updateFullUser(this.user).subscribe(user => {
      this.cartItems = user.cart.items;
      this.itemsAddedToCart = this.user.cart.items.length;
      this.appService.presentToast('הפריט נשמר בהצלחה', true);
    }, error => {
      this.appService.presentToast('חלה תקלה לא ניתן להוסיף את המוצר! נסה שנית מאוחר יותר', false);
    });
  }

  onItemRemovedFromCart(item: Item) {
    this.didAddItem = true;
    this.badgeColor = 'success';
    setTimeout(()=>{
      this.didAddItem = false;
      this.badgeColor = 'danger';
    }, 3000);
    const cartItemToRemove = this.cartItems.find(i => i.itemId === item.id);
    this.cartService.removeCartItem(cartItemToRemove.id).pipe(
      switchMap(() => {
        return this.userService.getFullUser(this.user.id);
      })
    ).subscribe(user => {
      this.cartItems = user.cart.items;
      this.itemsAddedToCart = this.user.cart.items.length;
      this.appService.presentToast('הפריט הוסר בהצלחה', true);
    }, error => {
      this.appService.presentToast('חלה תקלה לא ניתן להסיר את המוצר! נסה שנית מאוחר יותר', false);
    });
  }

  onGoToCart() {
    this.navController.navigateRoot(['/', 'cart']);
    // this.router.navigate(['/', 'cart', this.cart.id]);
  }


  getItemByCategory(category: string) {
    return this.items.filter(p => p.category === category).slice();
  }

  itemExistInCart(id: string) {
    return this?.cartItems.map(cartItem => cartItem.itemId).includes(id);
  }

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
