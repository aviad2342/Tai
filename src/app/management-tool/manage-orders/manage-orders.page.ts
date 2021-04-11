import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Order } from 'src/app/order/order.model';
import { OrderService } from 'src/app/order/order.service';
import { OrderItem } from 'src/app/store/item.model';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.page.html',
  styleUrls: ['./manage-orders.page.scss'],
})
export class ManageOrdersPage implements OnInit, OnDestroy {

  orders: Order[];
  selectedOrderId;
  private ordersSubscription: Subscription;
  @ViewChild('ordersTable') ordersTable: DatatableComponent;
	tableStyle = 'dark';
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];
  selectOrderdetails: Order;
  loadingSelectedOrder = false;
  items: OrderItem[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private alertController: AlertController,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.ordersSubscription = this.orderService.orders.subscribe(orders => {
        this.orders = orders;
        this.temp = [...this.orders];
      });
    }

    ionViewWillEnter() {
      this.orderService.getOrders().subscribe(orders => {
        if(this.selectedOrderId  && this.selectedOrderId !== '' && this.selectedOrderId !== null) {
          this.selected = []
          const order = orders.find(o => o.id === this.selectedOrderId);
          this.selected.push(order);
        }
      });
    }

    async onAddOrder() {
      this.selectedOrderId = null;
      this.isRowSelected = false;
      this.selected = [];
      this.router.navigate(['manage', 'orders', 'new']);
    }

    async onViewOrder() {
      this.router.navigate(['manage', 'orders', 'view', this.selectedOrderId]);
    }

    async onEditOrder() {
      this.router.navigate(['manage', 'orders', 'edit', this.selectedOrderId]);
    }

   async onDeleteOrder() {
      const alert = await this.alertController.create({
        cssClass: 'delete-order-alert',
        header: 'אישור מחיקת הזמנה',
        message: `האם אתה בטוח שברצונך למחוק את ההזמנה לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-order-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.orderService.deleteOrder(this.selectedOrderId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedOrderId = null;
                this.selected = [];
                this.appservice.presentToast('ההזמנה נמחק בהצלחה!', true);
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
    if(this.selectedOrderId === selected[0].id) {
      this.selected = [];
      this.selectedOrderId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedOrderId = selected[0].id;
    }
  }

  filterByOrederId(event) {
    const val = event.target.value;
    const temp = this.temp.filter((o)=> {
      return o.id.indexOf(val) !== -1 || !val;
  });
  this.orders = temp;
}

  filterByLastName(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.lastName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.orders = temp;
}

  filterByMail(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.orders = temp;
}

  filterByCity(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.city.toLowerCase().indexOf(val) !== -1 || !val;
  });
    this.orders = temp;
  }

  getUserFullName() {
      return this.selected[0]?.firstName + ' ' + this.selected[0]?.lastName;
    }

  getOrderItems(id: string) {
      this.orderService.getOrderItems(id).subscribe(items => {
        this.items = items;
      }, error => {
        console.log(error);
      });

      this.orderService.getOrder(id).subscribe(order => {
        this.selectOrderdetails = order;
      }, error => {
        console.log(error);
      });
    }

  toggleExpandRow(row) {
      this.ordersTable.rowDetail.toggleExpandRow(row);
    }

  onDetailToggle(event) {
    this.loadingSelectedOrder = true;
      // console.log('Detail Toggled', event.value);
      // this.orderService.getOrderItems(event.value.id).subscribe(items => {
      //   this.items = items;
      // }, error => {
      //   console.log(error);
      // });
      this.orderService.getOrder(event.value.id).subscribe(order => {
        this.selectOrderdetails = order;
        this.loadingSelectedOrder = false;
      }, error => {
        console.log(error);
      });
    }

  ngOnDestroy() {
      if (this.ordersSubscription) {
        this.ordersSubscription.unsubscribe();
      }
    }

}
