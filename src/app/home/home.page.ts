import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { UserLogged } from '../auth/userLogged.model';
import { HomeService } from './home.service';
import { Update } from './update.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  isDesktop: boolean;
  user: UserLogged;
  updates: Update[];
  isLoadingUpdates = false;
  private updatesSubscription: Subscription;
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
      slideShadows: false,
    },
  };

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private appService: AppService
    ) { }

  ngOnInit() {
     this.authService.user.subscribe(user => {
      this.user = user;
     });
     this.isLoadingUpdates = true;
     this.updatesSubscription = this.homeService.updates.subscribe( updates => {
       this.updates = updates;
       this.sliderOne = {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: updates
      };
       this.isLoadingUpdates = false;
     });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.homeService.getUpdates().subscribe();
    this.sliderOne = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: this.updates
    };
  }

  ngOnDestroy() {
    if (this.updatesSubscription) {
      this.updatesSubscription.unsubscribe();
    }
  }

}
