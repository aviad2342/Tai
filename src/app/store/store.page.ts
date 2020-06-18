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
  categories = ['ספרים', 'הרצאות', 'אביזרים', 'אחר'];
  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor( private storeService: StoreService ) { }

  ngOnInit() {
    this.itemsSubscription = this.storeService.items.subscribe(items => {
      this.items = items;
    });
  }

  ionViewWillEnter() {
    this.storeService.getItems().subscribe();
  }
  getItemByCategory(category: string) {
    const items = this.items.filter(p => p.category === category).slice();
    return items;
  }

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }

}
