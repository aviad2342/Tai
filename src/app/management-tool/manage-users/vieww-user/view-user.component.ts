import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UserService } from '../../../user/user.service';
import { User } from '../../../user/user.model';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {

  @Input() id: string;

  user: User;

  constructor(
    private alertController: AlertController,
    private userService: UserService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.userService.getUser(this.id).subscribe(user => {
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
                this.close();
              }
            }
          ]
        })
        .then(alertEl => alertEl.present());
    }
  );
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

  async close() {
    await this.modalController.dismiss();
  }

}
