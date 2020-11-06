import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Customer } from 'src/app/customer/customer.model';
import { CustomerService } from 'src/app/customer/customer.service';

@Component({
  selector: 'app-manage-customers',
  templateUrl: './manage-customers.page.html',
  styleUrls: ['./manage-customers.page.scss'],
})
export class ManageCustomersPage implements OnInit, OnDestroy {

  customers: Customer[];
  selectedCustomerId;
  private customersSubscription: Subscription;
  @ViewChild('customersTable') customersTable: DatatableComponent;
	tableStyle = 'dark';
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private alertController: AlertController,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.customersSubscription = this.customerService.customers.subscribe(customers => {
        this.customers = customers;
        this.temp = [...this.customers];
      });
    }

    ionViewWillEnter() {
      this.customerService.getCustomers().subscribe(customers => {
        if(this.selectedCustomerId  && this.selectedCustomerId !== '' && this.selectedCustomerId !== null) {
          this.selected = []
          const customer = customers.find(c => c.id === this.selectedCustomerId);
          this.selected.push(customer);
        }
      });
    }

    async onAddCustomer() {
      this.selectedCustomerId = null;
      this.isRowSelected = false;
      this.selected = [];
      this.router.navigate(['manage', 'customers', 'new']);
    }

    async onViewCustomer() {
      this.router.navigate(['manage', 'customers', 'view', this.selectedCustomerId]);
    }

    async onEditCustomer() {
      this.router.navigate(['manage', 'customers', 'edit', this.selectedCustomerId]);
    }

   async onDeleteCustomer() {
      const alert = await this.alertController.create({
        cssClass: 'delete-article-alert',
        header: 'אישור מחיקת לקוח',
        message: `האם אתה בטוח שברצונך למחוק את הלקוח לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-article-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.customerService.deleteCustomer(this.selectedCustomerId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedCustomerId = null;
                this.selected = [];
                this.appservice.presentToast('הלקוח נמחק בהצלחה!', true);
              }, error => {
                this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
              });
            }
          }
        ]
      });
      await alert.present();
  }

  onSelect({ selected }) {
    if(this.selectedCustomerId === selected[0].id) {
      this.selected = [];
      this.selectedCustomerId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedCustomerId = selected[0].id;
    }
  }

  filterByFirstName(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.customers = temp;
}

  filterByLastName(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.lastName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.customers = temp;
}

  filterByMail(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.customers = temp;
}

  filterByCity(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.city.toLowerCase().indexOf(val) !== -1 || !val;
  });
    this.customers = temp;
  }

  getUserFullName() {
      return this.selected[0]?.firstName + ' ' + this.selected[0]?.lastName;
    }

  ngOnDestroy() {
      if (this.customersSubscription) {
        this.customersSubscription.unsubscribe();
      }
    }

}
