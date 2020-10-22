import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AlertController, IonSegment, IonSlides, ModalController } from '@ionic/angular';
import { Category, Item } from '../../../store/item.model';
import { ItemService } from '../../../../app/store/item.service';
import { Router } from '@angular/router';
import { AppService } from '../../../../app/app.service';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CurrencyPipe } from '@angular/common';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  item: Item;
  category: Category;
  @ViewChild('addItemSlides') addItemSlides: IonSlides;
  @ViewChild('categorySegment') categorySegment: IonSegment;
  @ViewChild('f', { static: true }) form: NgForm;
  selectedCategory = '';
  file: File;
  slideOpts = {
    allowSlidePrev: true,
    allowTouchMove: false
  };

  categories = {
    BOOKS: 'ספרים',
    LECTURES: 'הרצאות',
    TREATMENTS: 'טיפולים',
    CONFERENCES: 'כנסים',
    ARTICLES: 'מאמרים',
    ACCESSORIES: 'אביזרים',
    OTHER: 'אחר'
  };

  constructor(
    private itemService: ItemService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    // private currencyPipe: CurrencyPipe,
    private appService: AppService
    ) { }

  ngOnInit() {
  }

  onCategoryChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.selectedCategory = event.detail.value;
    if (event.detail.value === this.categories.BOOKS) {
      this.addItemSlides.slideTo(0);
    } else {
      this.addItemSlides.slideTo(1);
    }
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
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
    this.file = imageFile;
    this.form.value.image = imageFile;
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      return;
    }
    this.itemService.uploadItemThumbnail(this.form.value.image, 'Item')
    .pipe(
      switchMap(uploadRes => {
      const itemToAdd = new Item(
        null,
        uuidv4(),
        form.value.name,
        form.value.description,
        form.value.price,
        uploadRes.imageUrl,
        'asd12',
        form.value.quantity,
        this.selectedCategory
      );
      return this.itemService.addItem(itemToAdd);
    })).subscribe(() => {
      form.reset();
      this.appService.presentToast('הנואם נשמר בהצלחה', true);
      this.router.navigate(['/manage/items']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי הנואם לא נשמרו', false);
      this.router.navigate(['/manage/items']);
    } );
  }

  // getCurrency(amount: number) {
  //   return this.currencyPipe.transform(amount, 'ILS', true, 'he-HE');
  // }

}
