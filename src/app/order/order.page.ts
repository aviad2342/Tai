import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { CouponService } from '../store/coupon.service';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  order: Order;
  isLoading = false;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private couponService: CouponService,
    private orderService: OrderService,
    private authService: AuthService,
    public appService: AppService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.router.navigate(['/tabs/store']);
        return;
      }
      this.orderService.getOrder(paramMap.get('id')).subscribe(order => {
            this.order = order;
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את ההזמנה.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/tabs/store']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

}
