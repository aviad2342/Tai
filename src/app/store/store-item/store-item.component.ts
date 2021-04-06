import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../cart/cart.service';
import { Item } from '../item.model';

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss'],
})
export class StoreItemComponent implements OnInit {

  @Input() item: Item;
  disabled = false;
  @Output() selectedItem = new EventEmitter<Item>();

  constructor(
    private cartService: CartService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    // this.cartService.isItemInCart(this.authService.getLoggedUserId(), this.item.id)
    // .subscribe(inCart => {
    //   this.disabled = inCart;
    // });
    // this.disabled = this.cartItems.includes(this.item.id);
  }

  onItemSelected() {
    this.disabled = true;
    this.selectedItem.emit(this.item);
  }

}
