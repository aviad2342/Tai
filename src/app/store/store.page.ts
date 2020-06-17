import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from './store.service';
import { Item } from './item.model';


@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit, OnDestroy {

  items: Item[];
  isLoading = false;
  private itemsSubscription: Subscription;

  constructor( private storeService: StoreService ) { }

  ngOnInit() {
    this.itemsSubscription = this.storeService.items.subscribe(items => {
      this.items = items;
    });
  }

  ionViewWillEnter() {
    // this.isLoading = true;
    // this.storeService.fetchPlaces().subscribe(() => {
    //   this.isLoading = false;
    // });
  }

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }

}
