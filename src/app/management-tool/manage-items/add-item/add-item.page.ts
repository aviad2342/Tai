import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AlertController, IonInput, IonSegment, IonSlides, ModalController, NavController } from '@ionic/angular';
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
import Swiper from 'swiper';
import * as utility from '../../../utilities/functions';
import { Treatment } from '../../../treatment/treatment.model';
import { TreatmentService } from '../../../treatment/treatment.service';

registerLocaleData(localeHe, 'he-HE');

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit, AfterViewInit {

  item: Item;
  items: Item[];
  events: Event[];
  courses: Course[];
  articles: Article[];
  treatments: Treatment[];
  isEvent = false;
  isArticle = false;
  isCourse = false;
  isTreatment = false;
  isImageselected = false;
  selectedThumbnail = '';
  productId = '';
  price = '';
  swiper: Swiper;
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
    allowTouchMove: false,
    autoHeight: true
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
    private treatmentService: TreatmentService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private navController: NavController,
    private currencyPipe: CurrencyPipe,
    private appService: AppService
    ) { }

  ngOnInit() {
    this.selectedCategory = this.categories.BOOKS;
    this.itemService.getItems().subscribe(items => {
      this.items = items
    });
  }

  onSlideChange(ItemSlides: IonSlides) {
    ItemSlides.update();
  }

  async ngAfterViewInit() {
    this.swiper = await this.addItemSlides.getSwiper();
    this.swiper.updateAutoHeight();
}
  onCategoryChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.selectedCategory = event.detail.value;
    switch (event.detail.value) {
      case this.categories.BOOKS:
        this.form.reset();
        this.selectedThumbnail = '';
        this.productId = '';
        this.isImageselected = false;
        this.addItemSlides.slideTo(0);
        break;
    case this.categories.TREATMENTS:
      if(!this.treatments) {
        this.treatmentService.getTreatments().subscribe(treatments => {
          this.treatments = treatments.filter(t => this.items.map(i => i.productId).indexOf(t.id, 0) === -1);
          this.isTreatment = true;
          this.addItemSlides.slideTo(1, 500);
        });
      } else {
        this.addItemSlides.slideTo(1);
      }
        break;
    case this.categories.CONFERENCES:
      if(!this.events) {
        this.eventService.getEvents().subscribe(events => {
          this.events = events.filter(t => this.items.map(i => i.productId).indexOf(t.id, 0) === -1);
          this.isEvent = true;
          this.addItemSlides.slideTo(2, 500);
        });
      } else {
        this.addItemSlides.slideTo(2);
      }
        break;
    case this.categories.COURSES:
      if(!this.courses) {
        this.courseService.getCourses().subscribe(courses => {
          this.courses = courses.filter(t => this.items.map(i => i.productId).indexOf(t.id, 0) === -1);
          this.isCourse = true;
          this.addItemSlides.slideTo(3, 500);
        });
      } else {
        this.addItemSlides.slideTo(3);
      }
      break;
     case this.categories.ARTICLES:
       if(!this.articles) {
        this.articleService.getArticles().subscribe(articles => {
          this.articles = articles.filter(t => this.items.map(i => i.productId).indexOf(t.id, 0) === -1);
          this.isArticle = true;
          this.addItemSlides.slideTo(4, 500);
        });
       } else {
        this.addItemSlides.slideTo(4);
      }
        break;
    case this.categories.ACCESSORIES:
        this.form.reset();
        this.selectedThumbnail = '';
        this.productId = '';
        this.isImageselected = false;
        this.addItemSlides.slideTo(0);
        break;
     case this.categories.OTHER:
        this.form.reset();
        this.selectedThumbnail = '';
        this.productId = '';
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
    this.productId = event.id;
    const eventObj = {
      name:        event.title,
      description: event.description,
      price:       '',
      quantity:    event.maxCapacity,
      };
    this.form.setValue(eventObj);
    this.isImageselected = true;
    this.addItemSlides.slideTo(0);
  }

  onAddCourseItem(course: Course) {
    this.form.reset();
    this.selectedThumbnail = course.thumbnail;
    this.productId = course.id;
    const courseObj = {
      name:        course.title,
      description: course.description,
      price:       '',
      quantity:    1000,
      };
    this.form.setValue(courseObj);
    this.isImageselected = true;
    this.addItemSlides.slideTo(0);
  }

  onAddTreatmentItem(treatment: Treatment) {
    this.form.reset();
    this.selectedThumbnail = treatment.thumbnail;
    this.productId = treatment.id;
    const treatmentObj = {
      name:        treatment.treatmentName,
      description: treatment.description,
      price:       '',
      quantity:    1000,
      };
    this.form.setValue(treatmentObj);
    this.isImageselected = true;
    this.addItemSlides.slideTo(0);
  }

  onAddArticleItem(article: Article) {
    this.form.reset();
    this.selectedThumbnail = article.thumbnail;
    this.productId = article.id;
    const articleObj = {
      name:        article.title,
      description: article.subtitle,
      price:       '',
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
          if(this.productId === '') {
            this.productId = uuidv4();
          }
        const itemToAdd = new Item(
          null,
          this.productId,
          form.value.name,
          form.value.description,
          +this.prevAmount,
          uploadRes.imageUrl,
          'asd12',
          form.value.quantity,
          this.selectedCategory
        );
        return this.itemService.addItem(itemToAdd);
      })).subscribe(() => {
        form.reset();
        this.appService.presentToast('המוצר נשמר בהצלחה', true);
        this.navController.navigateBack('/manage/items');
      }, error => {
        console.log(error);
        form.reset();
        this.appService.presentToast('חלה תקלה פרטי המוצר לא נשמרו', false);
        this.navController.navigateBack('/manage/items');
      });
    } else {
      if(this.productId === '') {
        this.productId = uuidv4();
      }
      const itemToAdd = new Item(
        null,
        this.productId,
        form.value.name,
        form.value.description,
        +this.prevAmount,
        this.selectedThumbnail,
        'asd12',
        form.value.quantity,
        this.selectedCategory
      );
      return this.itemService.addItem(itemToAdd).subscribe(() => {
      form.reset();
      this.appService.presentToast('המוצר נשמר בהצלחה', true);
      this.navController.navigateBack('/manage/items');
    }, error => {
      console.log(error);
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המוצר לא נשמרו', false);
      this.navController.navigateBack('/manage/items');
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
    this.navController.navigateBack('/manage/items');
  }

}
