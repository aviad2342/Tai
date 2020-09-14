import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from './store.service';
import { Item } from './item.model';
import { AppService } from '../app.service';


@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit, OnDestroy {

  items: Item[];
  isLoading = false;
  private itemsSubscription: Subscription;
  isDesktop: boolean;
  categories = ['ספרים', 'הרצאות', 'אביזרים', 'אחר'];

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

  constructor( private storeService: StoreService, private appService: AppService) { }

  ngOnInit() {
    this.itemsSubscription = this.storeService.items.subscribe(items => {
      this.items = items;
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
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
