import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AlertController, IonInput, IonSegment, IonSlides, ModalController } from '@ionic/angular';
import { Category, Item } from '../../../store/item.model';
import { ItemService } from '../../../store/item.service';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CurrencyPipe } from '@angular/common';
import localeHe from '@angular/common/locales/he';
import { registerLocaleData } from '@angular/common';
import { Event } from '../../../event/event.model';
import { EventService } from '../../../event/event.service';
import { Course } from '../../../course/course.model';
import { CourseService } from '../../../course/course.service';
import { Article } from '../../../article/article.model';
import { ArticleService } from '../../../article/article.service';



registerLocaleData(localeHe, 'he-HE');

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
  events: Event[];
  courses: Course[];
  articles: Article[];
  isEvent = false;
  isArticle = false;
  isCourse = false;
  isImageselected = false;
  selectedThumbnail = '';
  category: Category;
  @ViewChild('addItemSlides') addItemSlides: IonSlides;
  @ViewChild('categorySegment') categorySegment: IonSegment;
  @ViewChild('f', { static: true }) form: NgForm;
  selectedCategory = '';
  selectedImage;
  amount = '';
  prevAmount = '';
  slideOpts = {
    allowSlidePrev: true,
    allowTouchMove: false
  };

  categories = {
    BOOKS: 'ספרים',
    TREATMENTS: 'טיפולים',
    CONFERENCES: 'כנסים',
    COURSES: 'קורסים',
    ARTICLES: 'מאמרים',
    ACCESSORIES: 'אביזרים',
    OTHER: 'אחר'
  };

  constructor(
    private itemService: ItemService,
    private eventService: EventService,
    private courseService: CourseService,
    private articleService: ArticleService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    private appService: AppService
    ) { }

  ngOnInit() {
  }

  onCategoryChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.selectedCategory = event.detail.value;
    switch (event.detail.value) {
      case this.categories.BOOKS:
        this.form.reset();
        this.selectedThumbnail = '';
        this.isImageselected = false;
        this.addItemSlides.slideTo(0);
        // this.addItemSlides.updateAutoHeight(200);
        break;
    case this.categories.TREATMENTS:
        this.addItemSlides.slideTo(1);
        break;
    case this.categories.CONFERENCES:
      if(!this.events) {
        this.eventService.getEvents().subscribe(events => {
          this.events = events;
          this.isEvent = true;
          this.addItemSlides.slideTo(2);
        });
      } else {
        this.addItemSlides.slideTo(2);
        // this.addItemSlides.updateAutoHeight(200);
      }
      // // this.addItemSlides.updateAutoHeight(200);
        break;
    case this.categories.COURSES:
      if(!this.courses) {
        this.courseService.getCourses().subscribe(courses => {
          this.courses = courses;
          this.isCourse = true;
          this.addItemSlides.slideTo(3);
        });
      } else {
        this.addItemSlides.slideTo(3);
        // this.addItemSlides.updateAutoHeight(200);
      }
      break;
     case this.categories.ARTICLES:
       if(!this.articles) {
        this.articleService.getArticles().subscribe(articles => {
          this.articles = articles;
          this.isArticle = true;
          this.addItemSlides.slideTo(4);
        });
       } else {
        this.addItemSlides.slideTo(4);
        // this.addItemSlides.updateAutoHeight(200);
      }
        break;
    case this.categories.ACCESSORIES:
        this.form.reset();
        this.selectedThumbnail = '';
        this.isImageselected = false;
        this.addItemSlides.slideTo(0);
        break;
     case this.categories.OTHER:
        this.form.reset();
        this.selectedThumbnail = '';
        this.isImageselected = false;
        this.addItemSlides.slideTo(0);
        break;

      default:
        this.form.reset();
        this.selectedThumbnail = '';
        this.isImageselected = false;
        this.addItemSlides.slideTo(0);
        break;
    }
  }

  onAddEventItem(event: Event) {
    this.form.reset();
    this.selectedThumbnail = event.thumbnail;
    const eventObj = {
      name:        event.title,
      description: event.description,
      price:       0,
      quantity:    event.maxCapacity,
      };
    this.form.setValue(eventObj);
    this.isImageselected = true;
    this.addItemSlides.slideTo(0);
  }

  onAddCourseItem(course: Course) {
    this.form.reset();
    this.selectedThumbnail = course.thumbnail;
    const courseObj = {
      name:        course.title,
      description: course.description,
      price:       0,
      quantity:    1000,
      };
    this.form.setValue(courseObj);
    this.isImageselected = true;
    this.addItemSlides.slideTo(0);
  }

  onAddArticleItem(article: Article) {
    this.form.reset();
    this.selectedThumbnail = article.thumbnail;
    const articleObj = {
      name:        article.title,
      description: article.subtitle,
      price:       0,
      quantity:    1000,
      };
    this.form.setValue(articleObj);
    this.isImageselected = true;
    this.addItemSlides.slideTo(0);
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
    this.selectedImage = imageFile;
    this.isImageselected = true;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if(this.selectedImage) {
      this.itemService.uploadItemThumbnail(this.selectedImage, 'Item')
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
        this.appService.presentToast('המוצר נשמר בהצלחה', true);
        this.router.navigate(['/manage/items']);
      }, error => {
        form.reset();
        this.appService.presentToast('חלה תקלה פרטי המוצר לא נשמרו', false);
        this.router.navigate(['/manage/items']);
      });
    } else {
      const itemToAdd = new Item(
        null,
        uuidv4(),
        form.value.name,
        form.value.description,
        form.value.price,
        this.selectedThumbnail,
        'asd12',
        form.value.quantity,
        this.selectedCategory
      );
      return this.itemService.addItem(itemToAdd).subscribe(() => {
      form.reset();
      this.appService.presentToast('המוצר נשמר בהצלחה', true);
      this.router.navigate(['/manage/items']);
    }, error => {
      form.reset();
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

  onDoneAdding() {
    this.onSubmit(this.form);
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/items']);
  }

}
