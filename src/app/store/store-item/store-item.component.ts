import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../item.model';

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss'],
})
export class StoreItemComponent implements OnInit {

  @Input() item: Item;
  @Input() disabled = false;
  @Output() selectedItem = new EventEmitter<Item>();

  constructor() { }

  ngOnInit() {
  }

  onItemSelected() {
    this.selectedItem.emit(this.item);
  }

}
