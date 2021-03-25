import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { ModalController, NavController } from '@ionic/angular';
import { Update } from '../../../home/update.model';
import { AppService } from '../../..//app.service';
import { HomeService } from '../../../home/home.service';
import * as utility from '../../../utilities/functions';
import { UpdateItemComponent } from '../update-item/update-item.component';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.page.html',
  styleUrls: ['./add-update.page.scss'],
})
export class AddUpdatePage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  productId = '';
  productType = '';
  updateType = '';
  url = '';
  now = new Date().toISOString();
  didSelecteUpdateType = false;
  updateTypesValid = false;
  updateTypes = utility.updateTypes;
  updateTypesSelectOptions = {
    backdropDismiss: false,
    cssClass: 'select-types-alert',
    header: 'בחר סוג עדכון מהרשימה'
  };


  constructor(
    private homeService: HomeService,
    public appService: AppService,
    private navController: NavController,
    private modalController: ModalController
    ) { }

  ngOnInit() {
  }


  onSelecteUpdateType(event: CustomEvent<SegmentChangeEventDetail>) {
    this.updateTypesValid = false;
    this.updateType = event.detail.value;
    switch (event.detail.value) {
      case this.updateTypes.PRODUCT:
        this.productType = 'item';
        this.didSelecteUpdateType = true;
        break;
      case this.updateTypes.TREATMENT:
        this.productType = 'treatment';
        this.didSelecteUpdateType = true;
          break;
      case this.updateTypes.CONFERENCE:
        this.productType = 'event';
        this.didSelecteUpdateType = true;
          break;
      case this.updateTypes.COURSE:
        this.productType = 'course';
        this.didSelecteUpdateType = true;
          break;
      case this.updateTypes.ARTICLE:
        this.productType = 'article';
        this.didSelecteUpdateType = true;
          break;
      case this.updateTypes.TESTIMONY:
        this.productType = 'testimony';
        this.didSelecteUpdateType = true;
          break;
      case this.updateTypes.THERAPIST:
        this.productType = 'therapist';
        this.didSelecteUpdateType = true;
          break;
      case this.updateTypes.NEWS:
        this.productType = 'news';
        this.didSelecteUpdateType = false;
          break;
      case this.updateTypes.OTHER:
        this.productType = 'other';
        this.didSelecteUpdateType = false;
          break;

      default:
        break;
    }
  }

  onUpdateTypeCancel(event: CustomEvent<SegmentChangeEventDetail>) {
    if(event || event === null) {
      this.updateTypesValid = true;

    }
  }

  async onSelecteProduct() {
    const modal = await this.modalController.create({
      component: UpdateItemComponent,
      cssClass: 'add-speaker-modal',
      animated: true,
      backdropDismiss: false,
      componentProps: {
        eventId: this.productType
      }
    });
     modal.onDidDismiss<string>().then( data => {
      if(data.data !== null  && data.data ) {
        console.log(data);
      }
    });
    return await modal.present();
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (!this.didSelecteUpdateType) {
      return;
    }

    const updateToAdd = new Update(
          null,
          this.updateType,
          form.value.description,
          new Date(),
          form.value.endUpdate,
          this.url,
          true,
          this.productId
        );
      this.homeService.addUpdate(updateToAdd).subscribe(() => {
      this.appService.presentToast('העדות נשמרה בהצלחה', true);
      this.navController.navigateBack('/manage/updates');
      form.reset();
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי העדות לא נשמרו', false);
    }
    );
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/updates');
  }

}
