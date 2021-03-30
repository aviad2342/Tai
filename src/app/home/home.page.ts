import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
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

  updates: Update[];
  isDesktop: boolean;
  user: UserLogged;
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
    }
  };


  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private navController: NavController,
    private appService: AppService
    ) { }

  ngOnInit() {
    this.isDesktop = this.appService.isDesktop();
     this.authService.user.subscribe(user => {
      this.user = user;
     });
     this.updatesSubscription = this.homeService.updates.subscribe( updates => {
      this.updates = updates;
      this.sliderOne = {
       isBeginningSlide: true,
       isEndSlide: false,
       slidesItems: this.updates
     };
      this.isLoadingUpdates = false;
    });
  }

  ionViewWillLeave(){
    this.updatesSlides.stopAutoplay();
    }

    ionViewDidEnter() {
    this.updatesSlides.startAutoplay();
    }

  ionViewWillEnter() {
    this.homeService.getUpdates().subscribe();
  }

  ngOnDestroy() {
    if (this.updatesSubscription) {
      this.updatesSubscription.unsubscribe();
    }
  }

}
