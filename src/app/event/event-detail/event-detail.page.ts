import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';
import { AlertController, NavController } from '@ionic/angular';
import { Event } from '../event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event: Event;
  activeUrl = '';
  isLoading = false;

  speakerSlideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private eventService: EventService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/event');
        return;
      }
      this.isLoading = true;
      this.eventService.getEvent(paramMap.get('id')).subscribe(event => {
            this.event = event;
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את האירוע.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.isLoading = true;
                        this.navController.navigateBack('/tabs/event');
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

  getAddress() {
    return this.event?.street + ' ' + this.event?.houseNumber + ', ' + this.event?.city + ', ' + this.event?.country;
  }

}
