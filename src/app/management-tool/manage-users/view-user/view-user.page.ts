import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { User } from '../../../user/user.model';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.page.html',
  styleUrls: ['./view-user.page.scss'],
})
export class ViewUserPage implements OnInit {

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
        this.navController.navigateBack('/manage/users');
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
                        this.navController.navigateBack('/manage/users');
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

  getUserAge() {
    return new Date().getFullYear() - new Date(this.user?.date).getFullYear();
  }

  public ageFromDateOfBirthday(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  getAddress() {
    return this.user?.address.street + ' ' +
     this.user?.address.houseNumber + ', ' +
     this.user?.address.city + ', ' +
     this.user?.address.country;
  }

}
