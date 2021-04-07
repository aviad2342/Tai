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
  @Input() itemInCart = false;
  @Output() selectedItem = new EventEmitter<Item>();
  @Output() unselectItem = new EventEmitter<Item>();

  constructor(
    ) { }

  ngOnInit() {
  }

  onItemSelected() {
    if(this.itemInCart) {
      this.unselectItem.emit(this.item);
      this.itemInCart = false;
    } else {
      this.selectedItem.emit(this.item);
      this.itemInCart = true;
    }
  }

}
