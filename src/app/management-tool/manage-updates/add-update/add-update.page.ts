import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { ModalController, NavController } from '@ionic/angular';
import { ProductData, Update } from '../../../home/update.model';
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
  updateContent = '';
  selectedProductImage = 'https://lh3.googleusercontent.com/proxy/7fPvodKW9MuwkJjV5uBel7a2cmAJe9HTAOlc416RzsyL7GIsZ6uyhf7fYUR5Fxq_Z40Uqvk3odQ4x0H1arR4NZnbXUINf0pHtI7_LFvUcs7F';
  selectedProductName = '';
  selectedProductType = '';
  now = new Date().toISOString();
  didSelecteUpdateType = false;
  updateTypesValid = false;
  productSelected = false;
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
    this.reSelectUpdateType();
    this.updateTypesValid = false;
    this.updateType = event.detail.value;
    switch (event.detail.value) {
      case this.updateTypes.PRODUCT:
        this.productType = 'item';
        this.didSelecteUpdateType = true;
        this.updateContent = 'מוצר חדש זמין בחנות: ';
        break;
      case this.updateTypes.TREATMENT:
        this.productType = 'treatment';
        this.didSelecteUpdateType = true;
        this.updateContent = 'טיפול חדש: ';
          break;
      case this.updateTypes.CONFERENCE:
        this.productType = 'event';
        this.didSelecteUpdateType = true;
        this.updateContent = 'אירוע חדש: ';
          break;
      case this.updateTypes.COURSE:
        this.productType = 'course';
        this.didSelecteUpdateType = true;
        this.updateContent = 'קורס חדש: ';
          break;
      case this.updateTypes.ARTICLE:
        this.productType = 'article';
        this.didSelecteUpdateType = true;
        this.updateContent = 'מאמר חדש: ';
          break;
      case this.updateTypes.TESTIMONY:
        this.productType = 'testimony';
        this.didSelecteUpdateType = true;
        this.updateContent = 'עדות חדשה: ';
          break;
      case this.updateTypes.THERAPIST:
        this.productType = 'therapist';
        this.didSelecteUpdateType = true;
        this.updateContent = 'מטפל/ת חדש/ה: ';
          break;
      case this.updateTypes.NEWS:
        this.productType = 'news';
        this.didSelecteUpdateType = false;
        this.url = '/';
        this.productSelected = true;
          break;
      case this.updateTypes.OTHER:
        this.productType = 'other';
        this.didSelecteUpdateType = false;
        this.url = '/';
        this.productSelected = true;
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
    this.reSelectPproduct();
    const modal = await this.modalController.create({
      component: UpdateItemComponent,
      cssClass: 'add-speaker-modal',
      animated: true,
      backdropDismiss: false,
      componentProps: {
        updateType: this.productType,
        typeName : this.updateType
      }
    });
     modal.onDidDismiss<ProductData>().then( data => {
      if(data.data !== null  && data.data ) {
         this.productId = data.data.id;
         this.url = data.data.url;
         this.selectedProductImage = data.data.thumbnail;
         this.selectedProductName = data.data.name;
         this.selectedProductType = data.data.type;
         this.productSelected = true;
      }
    });
    return await modal.present();
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (!this.didSelecteUpdateType && !this.productSelected) {
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
      this.appService.presentToast('העדכון נשמרה בהצלחה', true);
      this.navController.navigateBack('/manage/updates');
      form.reset();
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי העדכון לא נשמרו', false);
    }
    );
  }

  reSelectPproduct() {
    this.productId = '';
    this.url = '';
    this.selectedProductImage = 'https://lh3.googleusercontent.com/proxy/7fPvodKW9MuwkJjV5uBel7a2cmAJe9HTAOlc416RzsyL7GIsZ6uyhf7fYUR5Fxq_Z40Uqvk3odQ4x0H1arR4NZnbXUINf0pHtI7_LFvUcs7F';
    this.selectedProductName = '';
    this.selectedProductType = '';
    this.productSelected = false;
  }

  reSelectUpdateType() {
    this.productId = '';
    this.url = '';
    this.updateContent = '';
    this.selectedProductType = '';
    this.selectedProductImage = 'https://lh3.googleusercontent.com/proxy/7fPvodKW9MuwkJjV5uBel7a2cmAJe9HTAOlc416RzsyL7GIsZ6uyhf7fYUR5Fxq_Z40Uqvk3odQ4x0H1arR4NZnbXUINf0pHtI7_LFvUcs7F';
    this.selectedProductName = '';
    this.productSelected = false;
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/updates');
  }

}
