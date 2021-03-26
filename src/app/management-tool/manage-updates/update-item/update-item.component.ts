import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Article } from '../../../article/article.model';
import { Course } from '../../../course/course.model';
import { Event } from '../../../event/event.model';
import { Item } from '../../../store/item.model';
import { Treatment } from '../../../treatment/treatment.model';
import { ArticleService } from '../../../article/article.service';
import { CourseService } from '../../../course/course.service';
import { EventService } from '../../../event/event.service';
import { ItemService } from '../../../store/item.service';
import { TestimonyService } from '../../../testimony/testimony.service';
import { TherapistService } from '../../../therapist/therapist.service';
import { TreatmentService } from '../../../treatment/treatment.service';
import { Therapist } from '../../../therapist/therapist.model';
import { Testimony } from '../../../testimony/testimony.model';
import { ProductData } from '../../../home/update.model';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.scss'],
})
export class UpdateItemComponent implements OnInit {

  @Input() updateType: string;
  @Input() typeName: string;
  productData: ProductData;
  items: Item[];
  events: Event[];
  courses: Course[];
  articles: Article[];
  treatments: Treatment[];
  therapists: Therapist[];
  testimonies: Testimony[];
  isItem = false;
  isEvent = false;
  isArticle = false;
  isCourse = false;
  isTreatment = false;
  isTherapist = false;
  isTestimony = false;


  constructor(
    private itemService: ItemService,
    private eventService: EventService,
    private courseService: CourseService,
    private articleService: ArticleService,
    private treatmentService: TreatmentService,
    private therapistService: TherapistService,
    private testimonyService: TestimonyService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    switch (this.updateType) {
      case 'item':
        this.itemService.getItems().subscribe(items => {
          this.items = items;
          this.isItem = true;
        });
        break;
      case 'treatment':
        this.treatmentService.getTreatments().subscribe(treatments => {
          this.treatments = treatments;
          this.isTreatment = true;
        });
          break;
      case 'event':
        this.eventService.getEvents().subscribe(events => {
          this.events = events;
          this.isEvent = true;
        });
          break;
      case 'course':
        this.courseService.getCourses().subscribe(courses => {
          this.courses = courses;
          this.isCourse = true;
        });
          break;
      case 'article':
        this.articleService.getArticles().subscribe(articles => {
          this.articles = articles;
          this.isArticle = true;
        });
          break;
      case 'testimony':
        this.testimonyService.getTestimonies().subscribe(testimonies => {
          this.testimonies = testimonies;
          this.isTestimony = true;
        });
          break;
      case 'therapist':
        this.therapistService.getTherapists().subscribe(therapists => {
          this.therapists = therapists;
          this.isTherapist = true;
        });
          break;
      default:
        break;
    }
  }

  onSelectItem(item: Item ) {
    this.productData = new ProductData(
      item.id,
      item.name,
      item.description,
      item.category,
      `/tabs/store`,
      item.thumbnail
    );
    this.close();
  }
  onSelectEvent(event: Event) {
    this.productData = new ProductData(
      event.id,
      event.title,
      event.description,
      this.typeName,
      `/tabs/events/${event.id}`,
      event.thumbnail
    );
    this.close();
  }
  onSelectTreatment(treatment: Treatment) {
    this.productData = new ProductData(
      treatment.id,
      treatment.treatmentName,
      treatment.description,
      treatment.treatmentType,
      `/tabs/treatments/${treatment.id}`,
      treatment.thumbnail
    );
    this.close();
  }
  onSelectCourse(course: Course) {
    this.productData = new ProductData(
      course.id,
      course.title,
      course.description,
      this.typeName,
      `/tabs/course/${course.id}`,
      course.thumbnail
    );
    this.close();
  }
  onSelectTherapist(therapist: Therapist) {
    this.productData = new ProductData(
      therapist.id,
      therapist.firstName + ' ' + therapist.lastName,
      therapist.resume,
      therapist.treatmentTypes.toString(),
      `/tabs/therapists/${therapist.id}`,
      therapist.profilePicture
    );
    this.close();
  }
  onSelectTestimony(testimony: Testimony) {
    this.productData = new ProductData(
      testimony.id,
      testimony.firstName + ' ' + testimony.lastName,
      testimony.content,
      this.typeName,
      `/tabs/testimony`,
      testimony.picture
    );
    this.close();
  }
  onSelectArticle(article: Article) {
    this.productData = new ProductData(
      article.id,
      article.title,
      article.subtitle,
      this.typeName,
      `/tabs/article/${article.id}`,
      article.thumbnail
    );
    this.close();
  }

  async close() {
    await this.modalController.dismiss(this.productData);
  }

  async emptyClose() {
    await this.modalController.dismiss(null);
  }

}
