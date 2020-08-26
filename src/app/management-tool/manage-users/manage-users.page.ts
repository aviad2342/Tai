import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from 'projects/swimlane/ngx-datatable/src/public-api';
import { UserService } from 'src/app/user/user.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AddUserComponent } from './add-user/add-user.component';
import { Subscription } from 'rxjs';
import { User } from 'src/app/user/user.model';
import { ViewUserComponent } from './view-user/view-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AppService } from 'src/app/app.service';


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
	tableStyle = 'dark';
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];

  // rows = [
  //   { name: 'Austin', gender: 'Male', company: 'Swimlane' },
  //   { name: 'Dany', gender: 'Male', company: 'KFC' },
  //   { name: 'Molly', gender: 'Female', company: 'Burger King' }
  // ];
  // columns = [{ prop: 'מספר מזהה' }, { name: 'שם' }, { name: 'שם משפחה' }];

  constructor( private userservice: UserService,
    private modalController: ModalController,
    private alertController: AlertController,
    private appservice: AppService
    ) { }

  ngOnInit() {
    this.usersSubscription = this.userservice.users.subscribe(users => {
      this.users = users;
      this.temp = [...this.users];
    });
  }

  ionViewWillEnter() {
    this.userservice.getUsers().subscribe();
  }

  async onAddUser() {
    const modal = await this.modalController.create({
      component: AddUserComponent,
      cssClass: 'add-user-modal',
      animated: true
    },);
    return await modal.present();
  }

  async onViewUser() {
    const modal = await this.modalController.create({
      component: ViewUserComponent,
      cssClass: 'view-user-modal',
      componentProps: {
        id: this.selectedUserId
      }
    });
    return await modal.present();
  }

  async onEditUser() {
    const modal = await this.modalController.create({
      component: EditUserComponent,
      cssClass: 'edit-user-modal',
      componentProps: {
        id: this.selectedUserId
      }
    });
     modal.onDidDismiss().then( data => {
      if(data.data.didUpdate) {
        this.isRowSelected = false;
        this.selectedUserId = '';
      }
    });
    return await modal.present();
  }

  async onDeleteUser() {
      const alert = await this.alertController.create({
        cssClass: 'delete-user-alert',
        header: 'אישור מחיקת משתמש',
        message: `האם אתה בטוח שברצונך למחוק את המשתמש ${this.getUserFullName()} לצמיתות?`,
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
              });
            }
          }
        ]
      });
      await alert.present();
  }


  ionModalDidDismiss() {
    console.log('dis');
  }
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
      console.log('Select Event', selected[0], this.selected[0].id);
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

  getUserFullName() {
    return this.selected[0]?.firstName + ' ' + this.selected[0]?.lastName;
  }

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

}