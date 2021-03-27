import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Coupon } from 'src/app/store/coupon.model';
import { CouponService } from 'src/app/store/coupon.service';

@Component({
  selector: 'app-manage-coupons',
  templateUrl: './manage-coupons.page.html',
  styleUrls: ['./manage-coupons.page.scss'],
})
export class ManageCouponsPage implements OnInit, OnDestroy {

  coupons: Coupon[];
  selectedcouponCode;
  private couponSubscription: Subscription;
   @ViewChild('couponsTable') couponsTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor(
    private couponService: CouponService,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.couponSubscription = this.couponService.coupons.subscribe(coupons => {
        this.coupons = coupons;
        this.temp = [...coupons];
      });
    }

    ionViewWillEnter() {
      this.couponService.getCoupons().subscribe(coupons => {
        if(this.selectedcouponCode  && this.selectedcouponCode !== '' && this.selectedcouponCode !== null) {
          this.selected = [];
          const coupon = coupons.find(c => c.code === this.selectedcouponCode);
          this.selected.push(coupon);
        }
      });
    }

   onFilterCategories(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.category.toLowerCase().indexOf(val) !== -1 || !val;
     });
   this.coupons = temp;
    }

    filterValidCoupons(event) {
      this.selectedcouponCode = null;
      this.isRowSelected = false;
      this.selected = [];
      const val = event.target.value;
      let temp;
      if (val === 'valid') {
        temp = this.temp.filter((d: Coupon)=> {
          return d.expirationDate >= new Date();
         });
      }
      if (val === 'all') {
        temp = this.temp;
      }
     this.coupons = temp;
      }

  async onAddCoupon() {
    this.selectedcouponCode = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'coupons', 'new']);
  }

  async onViewCoupon() {
    this.router.navigate(['manage', 'coupons', 'view', this.selectedcouponCode]);
  }

  async onEditCoupon() {
    this.router.navigate(['manage', 'coupons', 'edit', this.selectedcouponCode]);
  }

  async onDeleteCoupon() {
      const alert = await this.alertController.create({
        cssClass: 'delete-coupon-alert',
        header: 'אישור מחיקת קופון',
        message: `האם אתה בטוח שברצונך למחוק את הקופון לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-coupon-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.couponService.deleteCoupon(this.selectedcouponCode).subscribe( () => {
                this.isRowSelected = false;
                this.selectedcouponCode = null;
                this.selected = [];
                this.appservice.presentToast('הקופון נמחק בהצלחה!', true);
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
    if(this.selectedcouponCode === selected[0].code) {
      this.selected = [];
      this.selectedcouponCode = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedcouponCode = selected[0].code;
    }
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  ngOnDestroy() {
    if (this.couponSubscription) {
      this.couponSubscription.unsubscribe();
    }
  }

}
