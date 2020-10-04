import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { EventService } from '../event.service';
import { Participant } from '../participant.model';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.page.html',
  styleUrls: ['./participants-list.page.scss'],
})
export class ParticipantsListPage implements OnInit {

  participants: Participant[];
  isLoading = false;
  temp = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private eventService: EventService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navController.navigateBack('/tabs/event');
        return;
      }
      this.isLoading = true;
      this.eventService.getEventParticipants(paramMap.get('eventId')).subscribe(participants => {
            this.participants = participants;
            this.isLoading = false;
            this.temp = [...this.participants];
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המשתתפים.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.navController.navigateBack('/tabs/event');
                      this.navController.back();
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  searchParticipant(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.participants = temp;
}

}
