import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonSlides, ModalController, NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import { AddParticipantComponent } from '../add-participant/add-participant.component';
import { AddSpeakerComponent } from '../add-speaker/add-speaker.component';
import { Participant } from '../../../event/participant.model';
import { AppService } from '../../../app.service';
import { Event } from '../../../event/event.model';
import { EventService } from '../../../event/event.service';
import { Speaker } from '../../../event/speaker.model';
import { Address } from '../../../shared/address.model';
import * as utility from '../../../utilities/functions';
import Swiper from 'swiper';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit, AfterViewInit {

  @ViewChild('stepper') newEventStepper: IonSlides;
  @ViewChild('f', { static: true }) form: NgForm;
  event: Event;
  eventId: string;
  files: File[] = [];
  speakers: Speaker[] = [];
  participants: Participant[] = [];
  hideList = false;
  swiper: Swiper;
  addressIsValid = false;
  imageIsValid = true;
  address: Address = new Address();
  defaultPicture = 'http://10.0.0.1:3000/images/user-default-image.png';
  userImage = '../../../assets/images/user-default-image.png';
  file: File;
  now = new Date().toISOString();
  // date: Date;
  // beginsAt: Date;
  // endsAt: Date;

  slideOpts = {
    allowSlidePrev: false,
    allowTouchMove: false,
    autoHeight: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  };

  constructor(
    private eventService: EventService,
    private modalController: ModalController,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    public appService: AppService
    ) { }

 onSlideChange(ItemSlides: IonSlides) {
      ItemSlides.update();
    }

  async ngAfterViewInit() {
      this.swiper = await this.newEventStepper.getSwiper();
      this.swiper.updateAutoHeight();
  }

  ngOnInit() {
  }

 // -------------------------------------------------- Event Functions ------------------------------------------------------

 onAddressPicked(address: Address) {
  this.address = address;
}

onAddressIsValid(isValid: boolean) {
  this.addressIsValid = isValid;
}

onImageIsValid(isValid: boolean) {
  this.imageIsValid = isValid;
}

onSubmit(form: NgForm) {
  form.value.image = this.file;
  if (!form.valid) {
    return;
  }
  if (!this.form.value.image) {
    this.imageIsValid = false;
    return;
  }
  this.eventService.uploadEventThumbnail(this.form.value.image, 'Event')
  .pipe(
    switchMap(uploadRes => {
      const eventToAdd = new Event(
        null,
        form.value.title,
        form.value.description,
        form.value.date,
        form.value.beginsAt,
        form.value.endsAt,
        uploadRes.imageUrl,
        form.value.maxCapacity,
        form.value.placeName,
        this.address.country,
        this.address.city,
        this.address.street,
        this.address.houseNumber,
        this.address.apartment,
        this.address.entry,
        'cc11',
        [],
        [],
        []
      );
      return this.eventService.addEvent(eventToAdd);
    })
  ).subscribe(newEvent => {
    this.event = newEvent;
    form.reset();
    this.appService.presentToast('האירוע נשמר בהצלחה', true);
    this.newEventStepper.slideNext();
    // (ionSlideDidChange)="onSlideChange(stepper)"
  }, error => {
    this.appService.presentToast('חלה תקלה פרטי האירוע לא נשמרו', false);
    this.navController.navigateBack('/manage/events');
  }
  );
}


 // -------------------------------------------------- Speaker Functions ----------------------------------------------------

 async onAddSpeaker() {
  const modal = await this.modalController.create({
    component: AddSpeakerComponent,
    cssClass: 'add-speaker-modal',
    animated: true,
    backdropDismiss: false,
    componentProps: {
      eventId: this.event.id
    }
  });
   modal.onDidDismiss<Speaker>().then( data => {
    if(data.data !== null  && data.data ) {
      this.speakers.push(data.data);
    }
  });
  return await modal.present();
}

onSaveSpeakers() {
  this.newEventStepper.slideNext();
  // (ionSlideDidChange)="onSlideChange(stepper)"
}

async onRemoveSpeaker(id: string) {
  const alert = await this.alertController.create({
    cssClass: 'remove-speaker-alert',
    header: 'הסרת נואם',
    message: `אתה בטוח שברצונך להסיר את הנואם?`,
    mode: 'ios',
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'delete-lesson-alert-btn-cancel',
        handler: () => {
        }
      }, {
        text: 'אישור',
        handler: () => {
          this.eventService.deleteSpeaker(id).subscribe(() => {
            this.event.speakers = this.event.speakers.filter(u => u.id !== id);
            this.appService.presentToast('הנואם הוסר בהצלחה', true);
          }, error => {
            this.appService.presentToast('חלה תקלה הנואם לא הוסר', false);
          });
        }
      }
    ]
  });
  await alert.present();
}

 // -------------------------------------------------- Participant Functions ------------------------------------------------

 async onAddParticipant() {
  const modal = await this.modalController.create({
    component: AddParticipantComponent,
    cssClass: 'add-participant-modal',
    animated: true,
    backdropDismiss: false,
    componentProps: {
      eventId: this.event.id
    }
  });
   modal.onDidDismiss<Participant[]>().then( data => {
    if(data.data !== null  && data.data ) {
      this.participants.push(...data.data);
    }
  });
  return await modal.present();
}

onSaveParticipants() {
  this.newEventStepper.slideNext();
  // (ionSlideDidChange)="onSlideChange(stepper)"
}

async onRemoveParticipant(id: string) {
  const alert = await this.alertController.create({
    cssClass: 'remove-participan-alert',
    header: 'הסרת משתתף',
    message: `אתה בטוח שברצונך להסיר את המשתתף?`,
    mode: 'ios',
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'delete-lesson-alert-btn-cancel',
        handler: () => {
        }
      }, {
        text: 'אישור',
        handler: () => {
          this.eventService.deleteParticipant(id).subscribe(() => {
            this.event.participants = this.event.participants.filter(u => u.id !== id);
            this.appService.presentToast('המשתתף הוסר בהצלחה', true);
          }, error => {
            this.appService.presentToast('חלה תקלה המשתתף לא הוסר', false);
          });
        }
      }
    ]
  });
  await alert.present();
}


 // -------------------------------------------------- Images Functions -----------------------------------------------------

 onFilesAdded(event) {
  this.files.push(...event.addedFiles);
}

onRemove(event) {
  this.files.splice(this.files.indexOf(event), 1);
}

 onSaveAndExit() {
  if(this.files) {
   this.eventService.uploadEventPhotos(this.files).pipe(
     switchMap( images => {
       return this.eventService.updateEventImages(this.event.id, images);
     }))
   .subscribe(() => {
     this.appService.presentToast('התמונות נוספו בהצלחה', true);
     this.navController.navigateBack('/manage/events');
   }, error => {
     this.appService.presentToast('חלה תקלה התמונות לא נשמרו', false);
     this.navController.navigateBack('/manage/events');
   });
  }
  this.appService.presentToast('סיימת בהצלחה את יצירת האירוע', true);
  this.navController.navigateBack('/manage/events');
 }

 // -------------------------------------------------- Utilities Functions --------------------------------------------------

  onImagePicked(imageData: string | File) {
    this.imageIsValid = true;
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
    this.file = imageFile;
    this.form.value.image = imageFile;
  }

  getSpeakerName(speaker: Speaker) {
    return speaker?.title + ' ' + speaker?.firstName + ' ' + speaker?.lastName;
  }

  getParticipantName(participant: Participant) {
    return  participant?.firstName + ' ' + participant?.lastName;
  }

  onCancel() {
    this.form.reset();
    this.navController.navigateBack('/manage/events');
  }

}
