import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from '../../../../projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { Event } from '../../event/event.model';
import { EventService } from '../../event/event.service';
import { Speaker } from '../../event/speaker.model';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.page.html',
  styleUrls: ['./manage-events.page.scss'],
})
export class ManageEventsPage implements OnInit, OnDestroy {

  events: Event[];
  speakers: Speaker[];
  selectedEventId;
  private eventSubscription: Subscription;
   @ViewChild('coursesTable') coursesTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor(
    private eventService: EventService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.eventSubscription = this.eventService.events.subscribe(events => {
        this.events = events;
        this.temp = [...this.events];
      });
    }

    ionViewWillEnter() {
      this.eventService.getEvents().subscribe(events => {
        if(this.selectedEventId  && this.selectedEventId !== '' && this.selectedEventId !== null) {
          this.selected = [];
          const event = events.find(e => e.id === this.selectedEventId);
          this.selected.push(event);
        }
      });
    }

   filterEvents(event) {
    this.selectedEventId = null;
    this.isRowSelected = false;
    this.selected = [];
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
     });
   this.events = temp;
    }

  async onAddEvent() {
    this.selectedEventId = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'events', 'new']);
  }

  async onViewEvent() {
    this.router.navigate(['manage', 'events', 'view', this.selectedEventId]);
  }

  async onEditEvent() {
    this.router.navigate(['manage', 'events', 'edit', this.selectedEventId]);
  }

  async onDeleteEvent() {
      const alert = await this.alertController.create({
        cssClass: 'delete-event-alert',
        header: 'אישור מחיקת אירוע',
        message: `האם אתה בטוח שברצונך למחוק את האירוע לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-event-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.eventService.deleteEvent(this.selectedEventId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedEventId = null;
                this.selected = [];
                this.appservice.presentToast('האירוע נמחק בהצלחה!', true);
              }, error => {
                this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
              });
            }
          }
        ]
      });
      await alert.present();
  }

  onViewLesson(id: string) {
    this.router.navigate(['manage', 'courses', 'lesson', id]);
  }

  onSelect({ selected }) {
    if(this.selectedEventId === selected[0].id) {
      this.selected = [];
      this.selectedEventId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedEventId = selected[0].id;
    }
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    // if (this.lessonSubscription) {
    //   this.lessonSubscription.unsubscribe();
    // }
  }

}
