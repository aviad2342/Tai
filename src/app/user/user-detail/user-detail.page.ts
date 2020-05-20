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

  image = 'https://scontent.fsdv2-1.fna.fbcdn.net/v/t1.0-1/p160x160/10600649_10152646233963389_887571430359705805_n.jpg?_nc_cat=111&_nc_sid=dbb9e7&_nc_oc=AQm7vaRHs9d86SYPun596Z41tnuC3tPcu0NDjZYgKBSZxPm90xqwRlJfXFhaxPUyrLg&_nc_ht=scontent.fsdv2-1.fna&_nc_tp=6&oh=1e604912d9fb58d74b6e9cb44684cae2&oe=5EDF347C';

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
                      this.router.navigate(['/tabs/user']);
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
