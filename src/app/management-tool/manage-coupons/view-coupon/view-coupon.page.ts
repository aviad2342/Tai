import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../store/coupon.service';
import { Coupon } from '../../../store/coupon.model';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../app.service';
import { PercentPipe } from '@angular/common';
import { Item } from '../../../store/item.model';
import { ItemService } from '../../../store/item.service';

@Component({
  selector: 'app-view-coupon',
  templateUrl: './view-coupon.page.html',
  styleUrls: ['./view-coupon.page.scss'],
})
export class ViewCouponPage implements OnInit {

  coupon: Coupon;
  item: Item;
  isLoading = false;
  activeUrl = '';


  constructor(
    private couponService: CouponService,
    private navController: NavController,
    private percentPipe: PercentPipe,
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private alertController: AlertController,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('code')) {
        this.navController.navigateBack('/manage/coupons');
        return;
      }
      this.couponService.getCoupon(paramMap.get('code')).subscribe(coupon => {
            this.coupon = coupon;
            if(coupon.singleItem && coupon.itemId) {
              this.itemService.getItem(coupon.itemId).subscribe(item => {
                this.item = item;
              });
            }
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את הקופון.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/manage/coupons');
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
