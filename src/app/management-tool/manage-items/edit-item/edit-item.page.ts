import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import localeHe from '@angular/common/locales/he';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput, NavController } from '@ionic/angular';
import { Item } from '../../../store/item.model';
import { ItemService } from '../../../store/item.service';
import { AppService } from 'src/app/app.service';
import { switchMap } from 'rxjs/operators';
import * as utility from '../../../utilities/functions';

registerLocaleData(localeHe, 'he-HE');

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {

  item: Item;
  isLoading = false;
  selectedImage;
  amount = '';
  prevAmount = '';
  @ViewChild('f', { static: true }) form: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private itemService: ItemService,
    private currencyPipe: CurrencyPipe,
    private appService: AppService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/items');
        return;
      }
      this.itemService.getItem(paramMap.get('id')).subscribe(item => {
            this.item = item;
            const eventObj = {
              name:        this.item.name,
              description: this.item.description,
              price:       this.getCurrency(this.item.price),
              quantity:    this.item.quantity,
              };
            this.form.setValue(eventObj);
            this.amount = this.getCurrency(this.item.price);
            this.prevAmount = this.item.price.toString();
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המוצר.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/manage/items']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = utility.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        this.appService.presentToast('חלה תקלה לא ניתן לשמור את התמונה!', false);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.selectedImage = imageFile;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if(this.selectedImage) {
      this.itemService.uploadItemThumbnail(this.selectedImage, 'Item')
      .pipe(
        switchMap(uploadRes => {
        const itemToupdate = new Item(
          this.item.id,
          this.item.productId,
          form.value.name,
          form.value.description,
          +this.prevAmount,
          uploadRes.imageUrl,
          'asd12',
          form.value.quantity,
          this.item.category
        );
        return this.itemService.updateItem(itemToupdate);
      })).subscribe(() => {
        form.reset();
        this.appService.presentToast('המוצר נשמר בהצלחה', true);
        this.router.navigate(['/manage/items']);
      }, error => {
        console.log(error);
        form.reset();
        this.appService.presentToast('חלה תקלה פרטי המוצר לא נשמרו', false);
        this.router.navigate(['/manage/items']);
      });
    } else {
      const itemToupdate = new Item(
        this.item.id,
        this.item.productId,
        form.value.name,
        form.value.description,
        +this.prevAmount,
        this.item.thumbnail,
        'asd12',
        form.value.quantity,
        this.item.category
      );
      return this.itemService.updateItem(itemToupdate).subscribe(() => {
      this.appService.presentToast('המוצר נשמר בהצלחה', true);
      this.router.navigate(['/manage/items']);
    }, error => {
      console.log(error);
      this.appService.presentToast('חלה תקלה פרטי המוצר לא נשמרו', false);
      this.router.navigate(['/manage/items']);
    });
    }

  }

  getCurrency(amount: number=0) {
    return this.currencyPipe.transform(amount, 'ILS', 'symbol');
  }

  setPrice(priceCtrl: IonInput) {
    priceCtrl.type = 'number';
    this.amount = this.prevAmount;
  }

  getPrice(priceCtrl: IonInput) {
    priceCtrl.type = 'text';
    this.prevAmount = this.form.value.price;
    this.amount  = this.getCurrency(+this.form.value.price);
  }

  onCancel() {
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/items']);
  }

}
