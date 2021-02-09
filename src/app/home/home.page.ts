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
  private updatesSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private appService: AppService
    ) { }

  ngOnInit() {
     this.authService.user.subscribe(user => {
      this.user = user;
     });
     this.updatesSubscription = this.homeService.updates.subscribe( updates => {
       this.updates = updates;
     });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.homeService.getUpdates().subscribe();
  }

  ngOnDestroy() {
    if (this.updatesSubscription) {
      this.updatesSubscription.unsubscribe();
    }
  }

}
