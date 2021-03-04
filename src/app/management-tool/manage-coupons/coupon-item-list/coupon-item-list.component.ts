import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Item } from '../../../store/item.model';
import { ItemService } from '../../../store/item.service';

@Component({
  selector: 'app-coupon-item-list',
  templateUrl: './coupon-item-list.component.html',
  styleUrls: ['./coupon-item-list.component.scss'],
})
export class CouponItemListComponent implements OnInit {

  items: Item[];

  constructor(
    private itemService: ItemService,
    private alertController: AlertController,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  async onEmptyExit() {
    const alert = await this.alertController.create({
      cssClass: 'delete-lesson-alert',
      header: 'סיום ללא בחירת מוצר',
      message: `האם ברצונך לצאת ללא בחירת מוצר?`,
      mode: 'ios',
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'delete-lesson-alert-btn-cancel',
          handler: () => {
          }
        }, {
          text: 'יציאה',
          handler: () => {
          this.close(null);
          }
        }
      ]
    });
    await alert.present();
  }

  async close(item: Item) {
    await this.modalController.dismiss(item);
  }

}
