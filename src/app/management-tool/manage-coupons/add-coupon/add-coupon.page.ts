import { PercentPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonInput, ModalController, NavController } from '@ionic/angular';
import { AppService } from '../../../app.service';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Coupon } from '../../../store/coupon.model';
import { CouponService } from '../../../store/coupon.service';
import { CouponItemListComponent } from '../coupon-item-list/coupon-item-list.component';
import { Item } from '../../../store/item.model';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.page.html',
  styleUrls: ['./add-coupon.page.scss'],
})
export class AddCouponPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  now = new Date().toISOString();
  amount = '';
  item: Item;
  prevAmount = '';
  singleItem = true;
  noItemPicked = false;
  itemThumbnail = 'https://img.icons8.com/plasticine/2x/product.png';

  constructor(
    private couponService: CouponService,
    private navController: NavController,
    private percentPipe: PercentPipe,
    private modalController: ModalController,
    private appService: AppService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.singleItem && (!this.item || this.item === null)) {
      this.noItemPicked = true;
      return;
    }

    const couponToAdd = new Coupon(
      form.value.code,
      new Date(),
      form.value.expirationDate,
      form.value.quantity,
      this.singleItem,
      +this.prevAmount,
    );

    if (this.singleItem) {
      couponToAdd.itemId = this.item.id;
    }

    this.couponService.addCoupon(couponToAdd).subscribe(() => {
      form.reset();
      this.appService.presentToast('הקופון נשמר בהצלחה', true);
      this.navController.navigateBack('/manage/coupons');
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי הקופון לא נשמרו', false);
      // this.navController.navigateBack('/manage/coupons');
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
