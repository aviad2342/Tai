import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Event } from '../../../event/event.model';
import { EventService } from '../../../event/event.service';


@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit {

  event: Event;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private eventService: EventService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/courses');
        return;
      }
      this.eventService.getEvent(paramMap.get('id')).subscribe(event => {
            this.event = event;
            console.log(event);
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המאמר.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/manage/courses']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  getAddress() {
    return this.event?.street + ' ' + this.event?.houseNumber + ', ' + this.event?.city + ', ' + this.event?.country;
  }

}
