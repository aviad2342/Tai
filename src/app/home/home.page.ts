import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { UserLogged } from '../auth/userLogged.model';
import { HomeUpdatesComponent } from './home-updates/home-updates.component';
import { HomeService } from './home.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isDesktop: boolean;
  user: UserLogged;


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
  }

}
