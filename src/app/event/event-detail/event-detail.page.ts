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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private eventService: EventService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/event');
        return;
      }
      this.eventService.getEvent(paramMap.get('id')).subscribe(event => {
            this.event = event;
          },
          error => {
            this.alertController
              .create({
                header: 'An error ocurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/tabs/event']);
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
