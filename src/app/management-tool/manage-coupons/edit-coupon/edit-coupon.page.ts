import { PercentPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput, IonSegment, ModalController, NavController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { ItemService } from '../../../store/item.service';
import { AppService } from '../../../app.service';
import { Coupon } from '../../../store/coupon.model';
import { CouponService } from '../../../store/coupon.service';
import { Item } from '../../../store/item.model';
import { CouponItemListComponent } from '../coupon-item-list/coupon-item-list.component';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.page.html',
  styleUrls: ['./edit-coupon.page.scss'],
})
export class EditCouponPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  @ViewChild('SingleItemSegment') segment: IonSegment;
  coupon: Coupon;
  now = new Date().toISOString();
  amount = '';
  activeUrl = '';
  item: Item;
  isLoading = false;
  prevAmount = '';
  singleItem = true;
  noItemPicked = false;
  itemThumbnail = '';

  constructor(
    private couponService: CouponService,
    private navController: NavController,
    private percentPipe: PercentPipe,
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private alertController: AlertController,
    private modalController: ModalController,
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
            this.singleItem = coupon.singleItem;
            this.segment.value = coupon.singleItem? 'singleItem' : 'fullOrder';
            if(coupon.singleItem && coupon.itemId) {
              this.itemService.getItem(coupon.itemId).subscribe(item => {
                this.itemThumbnail = item.thumbnail;
                this.item = item;
              });
            } else {
              this.itemThumbnail = 'https://img.icons8.com/plasticine/2x/product.png';
            }
            const couponObj = {
              code:           this.coupon.code,
              expirationDate: this.coupon.expirationDate,
              quantity:       this.coupon.quantity,
              discount:       this.getPercentage(this.coupon.discount)
              };
            this.form.setValue(couponObj);
            this.amount = this.getPercentage(this.coupon.discount)
            this.prevAmount = this.coupon.discount.toString();
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

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.singleItem && (!this.item || this.item === null)) {
      this.noItemPicked = true;
      return;
    }

    const couponToUpdate = new Coupon(
      this.coupon.code,
      this.coupon.date,
      form.value.expirationDate,
      form.value.quantity,
      this.singleItem,
      +this.prevAmount,
    );

    if (this.singleItem) {
      couponToUpdate.itemId = this.item.id;
    }

    this.couponService.addCoupon(couponToUpdate).subscribe(() => {
      form.reset();
      this.appService.presentToast('הקופון נשמר בהצלחה', true);
      this.navController.navigateBack('/manage/coupons');
    }, error => {
      if (this.router.isActive(this.activeUrl, false)) {
        form.reset();
      this.appService.presentToast('חלה תקלה פרטי הקופון לא נשמרו', false);
        this.navController.navigateBack('/manage/coupons');
      }
    }
    );
  }

  getPercentage(amount: number=0) {
    return this.percentPipe.transform(amount/ 100, '1.0');
  }

  setPercent(percent: IonInput) {
    percent.type = 'number';
    this.amount = this.prevAmount;
  }

  getPercent(percent: IonInput) {
    percent.type = 'text';
    this.prevAmount = this.form.value.discount;
    this.amount  = this.getPercentage(+this.form.value.discount);
  }

  isSingleItem(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'singleItem') {
      this.singleItem = true;
    }
    if (event.detail.value === 'fullOrder') {
      this.singleItem = false;
    }
    }

  async onChooseItem() {
    const modal = await this.modalController.create({
      component: CouponItemListComponent,
      cssClass: 'add-speaker-modal',
      animated: true,
      backdropDismiss: false,
    });
     modal.onDidDismiss<Item>().then( data => {
      if(data.data !== null  && data.data ) {
        this.item = data.data;
        this.itemThumbnail = this.item.thumbnail;
        this.noItemPicked = false;
      }
    });
    return await modal.present();
  }
  onRemoveItem() {
    this.item = null;
    this.noItemPicked = true;
    this.itemThumbnail = 'https://img.icons8.com/plasticine/2x/product.png';
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/coupons');
  }

}
