import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user.model';
import { AlertController, IonItemSliding, IonList } from '@ionic/angular';
import { AppService } from '../app.service';




@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, OnDestroy {

  users: User[] = [];
  @ViewChild('dynamicList') slidingList: IonList;
  private usersSubscription: Subscription;
  isDesktop: boolean;
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private appService: AppService,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.usersSubscription = this.userService.users.subscribe(users => {
      this.users = users;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.userService.getUsers().subscribe();
  }

  async onEdit(id: string) {
    await this.slidingList.closeSlidingItems();
    this.router.navigate(['tabs', 'user', 'edit', id]);
  }

  async onDelete(id: string) {
    await this.slidingList.closeSlidingItems();
    this.onDeleteUser(id);
  }

  async onDeleteUser(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'delete-user-alert',
      header: 'אישור מחיקת משתמש',
      message: `האם אתה בטוח שברצונך למחוק את המשתמש לצמיתות?`,
      mode: 'ios',
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'delete-user-alert-btn-cancel',
          handler: () => {
          }
        }, {
          text: 'אישור',
          handler: () => {
            this.userService.deleteUser(id).subscribe( () => {
              this.appService.presentToast('המשתמש נשמר בהצלחה', true);
            }, error => {
              this.appService.presentToast('חלה תקלה לא ניתן למחוק את המשתמש כעת!', false);
            });
          }
        }
      ]
    });
    await alert.present();
}

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

}
