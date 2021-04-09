import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Article } from '../../article/article.model';
import { Course } from '../../course/course.model';
import { Event } from '../../event/event.model';
import { Treatment } from '../../treatment/treatment.model';
import { ArticleService } from '../../article/article.service';
import { CourseService } from '../../course/course.service';
import { EventService } from '../../event/event.service';
import { TreatmentService } from '../../treatment/treatment.service';
import { Item } from '../item.model';
import { ItemService } from '../item.service';
import { Speaker } from '../../event/speaker.model';
import { ViewSpeakerComponent } from '../../management-tool/manage-events/view-speaker/view-speaker.component';
import { TherapistDetailComponent } from 'src/app/management-tool/manage-treatments/therapist-detail/therapist-detail.component';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {

  item: Item;
  article: Article;
  course: Course;
  event: Event;
  treatment: Treatment;
  activeUrl = '';
  isLoading = false;
  isArticle = false;
  isCourse = false;
  isEvent = false;
  isTreatment = false;
  isOther = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertController: AlertController,
    private itemService: ItemService,
    private articleService: ArticleService,
    private courseService: CourseService,
    private eventService: EventService,
    private treatmentService: TreatmentService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.back();
        return;
      }
      this.isLoading = true;
      this.itemService.getItem(paramMap.get('id')).pipe(
        switchMap(item => {
          this.item = item;
          this.isLoading = false;
          return this.itemService.getProductName(item.productId);
        })
      ).subscribe(productType => {
        switch (productType) {
          case 'article':
            this.articleService.getArticle(this.item.productId).subscribe(article => {
              this.article = article;
              this.isArticle = true;
            });
            break;
          case 'course':
            this.courseService.getCourse(this.item.productId).subscribe(course => {
              this.course = course;
              this.isCourse = true;
            });
            break;
          case 'event':
            this.eventService.getEvent(this.item.productId).subscribe(event => {
              this.event = event;
              this.isEvent = true;
            });
            break;
          case 'treatment':
            this.treatmentService.getTreatment(this.item.productId).subscribe(treatment => {
              this.treatment = treatment;
              this.isTreatment = true;
            });
            break;
          default:
            this.isOther = true;
            break;
        }

          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המוצר.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.isLoading = true;
                        this.navController.back();
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

  async onViewspeaker(speaker: Speaker) {
    const modal = await this.modalController.create({
      component: ViewSpeakerComponent,
      cssClass: 'view-speaker-modal',
      backdropDismiss: false,
      animated: true,
      componentProps: {
        speaker
      }
    });
    return await modal.present();
  }

  async onTherapistDetail(ev: any) {
    const popover = await this.popoverController.create({
      component: TherapistDetailComponent,
      cssClass: 'therapist-detail-popover',
      animated: true,
      mode: 'ios',
      event: ev,
      backdropDismiss: false,
      componentProps: {
        id: this.treatment.therapistId
      }
    });
    return await popover.present();
  }
}
