import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from '../user.service';
import { User } from '../user.model';



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit, OnDestroy {

  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/user');
        return;
      }
      this.userService.getUser(paramMap.get('id')).subscribe(user => {
            this.user = user;
          },
          error => {
            this.alertController
              .create({
                header: 'An error ocurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.navController.navigateBack('/tabs/user');
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  ngOnDestroy() {
  }

  getUserFullName() {
    return this.user?.firstName + ' ' + this.user?.lastName;
  }

  getUserAge() {
    return new Date().getFullYear() - new Date(this.user?.date).getFullYear();
  }

  getAddress() {
    return this.user?.street + ' ' + this.user?.houseNumber + ', ' + this.user?.city + ', ' + this.user?.country;
  }

}
