import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Speaker } from 'src/app/event/speaker.model';
import { Event } from '../../../event/event.model';
import { EventService } from '../../../event/event.service';
import { ViewParticipantComponent } from '../view-participant/view-participant.component';
import { ViewSpeakerComponent } from '../view-speaker/view-speaker.component';


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
    private modalController: ModalController,
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


  async onViewParticipants() {
    const modal = await this.modalController.create({
      component: ViewParticipantComponent,
      cssClass: 'view-participant-modal',
      backdropDismiss: false,
      animated: true,
      componentProps: {
        participants: this.event.participants
      }
    });
    return await modal.present();
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

  getAddress() {
    return this.event?.street + ' ' + this.event?.houseNumber + ', ' + this.event?.city + ', ' + this.event?.country;
  }

}
