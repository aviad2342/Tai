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
  activeUrl = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/user');
        return;
      }
      this.userService.getUser(paramMap.get('id')).subscribe(user => {
            this.user = user;
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'An error ocurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/tabs/user');
                      }
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
            }
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
    return this.user?.address.street + ' ' +
    this.user?.address.houseNumber + ', ' +
    this.user?.address.city + ', ' +
    this.user?.address.country;
  }

}
