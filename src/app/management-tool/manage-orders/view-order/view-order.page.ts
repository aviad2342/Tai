import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Order } from 'src/app/order/order.model';
import { OrderService } from 'src/app/order/order.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  order: Order;
  isLoading = false;
  activeUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private orderService: OrderService
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/orders');
        return;
      }
      this.orderService.getOrder(paramMap.get('id')).subscribe(order => {
            this.order = order;
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את ההזמנה.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/manage/orders');
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
}
