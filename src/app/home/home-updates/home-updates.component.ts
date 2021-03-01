import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { HomeService } from '../home.service';
import { Update } from '../update.model';

@Component({
  selector: 'app-home-updates',
  templateUrl: './home-updates.component.html',
  styleUrls: ['./home-updates.component.scss'],
})
export class HomeUpdatesComponent implements OnInit, OnDestroy {

  updates: Update[];
  @ViewChild('updatesSlides') updatesSlides: IonSlides
  private updatesSubscription: Subscription;
  isLoadingUpdates = false;
  sliderOne: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 'auto',
    autoplay: true,
    speed: 1000,
    loop: true,
    loopedSlides: null,
    allowTouchMove: false,
    autoHeight: true,
    direction: 'vertical',
    effect: 'cube',
    cubeEffect: {
      slideShadows: true,
    },
  };

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.isLoadingUpdates = true;
     this.updatesSubscription = this.homeService.updates.subscribe( updates => {
       this.updates = updates;
       this.sliderOne = {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: updates
      };
      setInterval(() => {
        this.updatesSlides.slideNext();
      }, 3000);
       this.isLoadingUpdates = false;
     });
  }

  ionViewWillEnter() {
    this.updatesSlides.startAutoplay();
    this.homeService.getUpdates().subscribe();
    setInterval(() => {
      this.updatesSlides.slideNext();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.updatesSubscription) {
      this.updatesSubscription.unsubscribe();
    }
  }

}
