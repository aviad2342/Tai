import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from 'projects/swimlane/ngx-datatable/src/public-api';
import { UserService } from 'src/app/user/user.service';
import { ModalController } from '@ionic/angular';
import { AddUserComponent } from './add-user/add-user.component';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageUsersPage implements OnInit {

  users;
  @ViewChild(DatatableComponent) usersTable: DatatableComponent;
	tableStyle = 'dark';
  isRowSelected = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];

  // rows = [
  //   { name: 'Austin', gender: 'Male', company: 'Swimlane' },
  //   { name: 'Dany', gender: 'Male', company: 'KFC' },
  //   { name: 'Molly', gender: 'Female', company: 'Burger King' }
  // ];
  // columns = [{ prop: 'מספר מזהה' }, { name: 'שם' }, { name: 'שם משפחה' }];

  constructor( private userservice: UserService , private modalController: ModalController) { }

  ngOnInit() {
    this.userservice.getAllUsers().subscribe(users => {
      this.users = users;
      this.temp = [...this.users];
    })
  }

  async onAddUser() {
    const modal = await this.modalController.create({
      component: AddUserComponent,
      cssClass: 'my-custom-class',
    },);
    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  switchStyle() {
		if (this.tableStyle === 'dark') {
			this.tableStyle = 'bootstrap';
		} else {
			this.tableStyle = 'dark';
		}
	}



	async open(row) {
		console.log(row);
  }

  onSelect({ selected }) {
    this.isRowSelected = true;
    console.log('Select Event', selected, this.selected[0]);
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter((d)=> {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    // this.usersTable.offset = 0;
  }

}
