import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '../../../../projects/swimlane/ngx-datatable/src/public-api';
import { UserService } from '../../user/user.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from '../../user/user.model';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageUsersPage implements OnInit, OnDestroy {

  users: User[];
  selectedUserId;
  private usersSubscription: Subscription;
  @ViewChild('usersTable') usersTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];

  constructor(
    private userservice: UserService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

  ngOnInit() {
    this.usersSubscription = this.userservice.users.subscribe(users => {
      this.users = users;
      this.temp = [...this.users];
    });
  }

  ionViewWillEnter() {
    this.userservice.getUsers().subscribe(users => {
      if(this.selectedUserId  && this.selectedUserId !== '' && this.selectedUserId !== null) {
        this.selected = []
        const user = users.find(u => u.id === this.selectedUserId);
        this.selected.push(user);
      }
    });
  }

  async onAddUser() {
    this.selectedUserId = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'users', 'new']);
  }

  async onViewUser() {
    this.router.navigate(['manage', 'users', 'view', this.selectedUserId]);
  }

  async onEditUser() {
    this.router.navigate(['manage', 'users', 'edit', this.selectedUserId]);
  }

  // async onAddUser() {
  //   this.selected = []
  //   this.selectedUserId = null;
  //   this.isRowSelected = false;
  //   const modal = await this.modalController.create({
  //     component: AddUserComponent,
  //     cssClass: 'add-user-modal',
  //     backdropDismiss: false,
  //     animated: true
  //   },);
  //   return await modal.present();
  // }

  // async onViewUser() {
  //   const modal = await this.modalController.create({
  //     component: ViewUserComponent,
  //     cssClass: 'view-user-modal',
  //     animated: true,
  //     componentProps: {
  //       id: this.selectedUserId
  //     }
  //   });
  //   return await modal.present();
  // }

  // async onEditUser() {
  //   const modal = await this.modalController.create({
  //     component: EditUserComponent,
  //     cssClass: 'edit-user-modal',
  //     backdropDismiss: false,
  //     animated: true,
  //     componentProps: {
  //       id: this.selectedUserId
  //     }
  //   });
  //    modal.onDidDismiss<User>().then( data => {
  //     if(data.data !== null  && data.data ) {
  //       this.selected = [];
  //       this.selected.push(data.data);
  //       // this.selected[0] = this.users.find(u => u.id === this.selectedUserId);
  //       // this.isRowSelected = true;
  //     }
  //   });
  //   return await modal.present();
  // }

  async onDeleteUser() {
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
              this.userservice.deleteUser(this.selectedUserId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedUserId = null;
                this.selected = [];
              });
            }
          }
        ]
      });
      await alert.present();
  }


  ionModalDidDismiss() {}
  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  onSelect({ selected }) {
    if(this.selectedUserId === selected[0].id) {
      this.selected = [];
      this.selectedUserId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedUserId = selected[0].id;
    }
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  filterByFirstName(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.users = temp;
}

  filterByLastName(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.lastName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.users = temp;
}

  filterByMail(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.users = temp;
}

  filterByCity(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.city.toLowerCase().indexOf(val) !== -1 || !val;
  });
    this.users = temp;
  }

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

}
