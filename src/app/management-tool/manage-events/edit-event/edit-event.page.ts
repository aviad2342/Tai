import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSlides, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Event } from 'src/app/event/event.model';
import { EventService } from 'src/app/event/event.service';
import { Participant } from 'src/app/event/participant.model';
import { Speaker } from 'src/app/event/speaker.model';
import { Address } from 'src/app/shared/address.model';
import { AddParticipantComponent } from '../add-participant/add-participant.component';
import { AddSpeakerComponent } from '../add-speaker/add-speaker.component';
import { EditSpeakerComponent } from '../edit-speaker/edit-speaker.component';


function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  event: Event;
  private pageparamMapSubscription: Subscription;
  id: string;
  @ViewChild('stepper') newEventStepper: IonSlides;
  @ViewChild('f', { static: true }) form: NgForm;
  files: File[] = [];
  file: File;
  address: Address = new Address();
  images;
  defaultPicture = 'http://localhost:3000/images/user-default-image.png';
  addressIsValid = false;
  isLoading = false;
  lessonsIsLoading = false;
  now = new Date().toISOString();
  date: Date;
  beginsAt: Date;
  endsAt: Date;

  slideOpts = {
    allowSlidePrev: false,
    allowTouchMove: false,
    autoHeight: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  };


  pickerOptions = {
    mode: 'ios',
    cssClass: 'date-picker-class',
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'picker-cancel-btn'
      },
      {
        text: 'אישור',
        role: 'confirm',
        cssClass: 'picker-confirm-btn',
        handler: (value: any) => {
          this.date = new Date(value.year.value+'-'+ value.month.value+'-'+ value.day.value);
        }
      }
    ]
  };

  beginsAtpickerOptions = {
    cssClass: 'date-picker-class',
    mode: 'ios',
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'picker-cancel-btn'
      },
      {
        text: 'אישור',
        role: 'confirm',
        cssClass: 'picker-confirm-btn',
        handler: (value: any) => {
    this.beginsAt = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), value.hour.value, value.minute.value,0 ,0);
        }
      }
    ]
  };

  endsAtpickerOptions = {
    cssClass: 'date-picker-class',
    mode: 'ios',
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'picker-cancel-btn'
      },
      {
        text: 'אישור',
        role: 'confirm',
        cssClass: 'picker-confirm-btn',
        handler: (value: any) => {
      this.endsAt = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), value.hour.value, value.minute.value,0 ,0);
        }
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private navCtrl: NavController,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    public appService: AppService
  ) {}

  ngOnInit() {
    this.pageparamMapSubscription = this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/manage/events');
        return;
      }
      this.isLoading = true;
      this.id = paramMap.get('id');
      this.eventService.getEvent(paramMap.get('id')).
      subscribe(event => {
        this.event = event;
        this.isLoading = false;
        this.date = this.event.date;
        this.beginsAt = this.event.beginsAt;
        this.endsAt = this.event.endsAt;
        const eventObj = {
          title:         event.title,
          description:   event.description,
          date:          event.date,
          beginsAt:      event.beginsAt,
          endsAt:        event.endsAt,
          maxCapacity:   event.maxCapacity,
          placeName:     event.placeName,
          };
        this.form.setValue(eventObj);
        this.address.setAddress(
          this.event.country,
          this.event.city,
          this.event.street,
          this.event.houseNumber,
          this.event.apartment,
          this.event.entry);
      }, error => {
        this.appService.presentToast('חלה תקלה לא ניתן לבצע עריכה! אנא נסה מאוחר יותר.', false);
        this.router.navigate(['/manage/events']);
      });
    });
  }

// -------------------------------------------------- Event Functions ------------------------------------------------------

onAddressPicked(address: Address) {
  this.address = address;
}

onAddressIsValid(isValid: boolean) {
  this.addressIsValid = isValid;
}

onSubmit(form: NgForm) {
  if (!form.valid) {
    return;
  }
  if (form.value.image) {
  this.eventService.uploadEventThumbnail(this.form.value.image, 'Event')
  .pipe(
    switchMap(uploadRes => {
      const eventToAdd = new Event(
        this.event.id,
        form.value.title,
        form.value.description,
        this.date,
        this.beginsAt,
        this.endsAt,
        uploadRes.imageUrl,
        form.value.maxCapacity,
        form.value.placeName,
        this.address.country,
        this.address.city,
        this.address.street,
        this.address.houseNumber,
        this.address.apartment,
        this.address.entry,
        this.event.catalogNumber,
        this.event.images,
        this.event.participants,
        this.event.speakers
      );
      return this.eventService.updateEventAndThumbnail(eventToAdd);
    })
  ).subscribe(newEvent => {
    this.event = newEvent;
    this.appService.presentToast('האירוע נשמר בהצלחה', true);
    this.newEventStepper.slideNext();
    this.newEventStepper.updateAutoHeight(200);
  }, error => {
    this.appService.presentToast('חלה תקלה פרטי האירוע לא נשמרו', false);
    this.router.navigate(['/manage/events']);
  }
  );
} else {
  const eventToAdd = new Event(
    this.event.id,
    form.value.title,
    form.value.description,
    this.date,
    this.beginsAt,
    this.endsAt,
    this.event.thumbnail,
    form.value.maxCapacity,
    form.value.placeName,
    this.address.country,
    this.address.city,
    this.address.street,
    this.address.houseNumber,
    this.address.apartment,
    this.address.entry,
    this.event.catalogNumber,
    this.event.images,
    this.event.participants,
    this.event.speakers
  );
  if(this.isEquals(this.event, eventToAdd)) {
    this.newEventStepper.slideNext();
    this.newEventStepper.updateAutoHeight(200);
    return;
  }
  return this.eventService.updateEvent(eventToAdd).subscribe(newEvent => {
    this.event = newEvent;
    this.appService.presentToast('האירוע נשמר בהצלחה', true);
    this.newEventStepper.slideNext();
    this.newEventStepper.updateAutoHeight(200);
  }, error => {
    this.appService.presentToast('חלה תקלה פרטי האירוע לא נשמרו', false);
    this.router.navigate(['/manage/events']);
  });
}
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
      this.event.speakers.push(data.data);
    }
  });
  return await modal.present();
}

onSaveSpeakers() {
  this.newEventStepper.slideNext();
  this.newEventStepper.updateAutoHeight(200);
}

async onEditSpeaker(speaker: Speaker) {
  const modal = await this.modalController.create({
    component: EditSpeakerComponent,
    cssClass: 'edit-speaker-modal',
    animated: true,
    backdropDismiss: false,
    componentProps: {
      speaker
    }
  });
   modal.onDidDismiss<Speaker>().then( data => {
    if(data.data !== null  && data.data ) {
      this.event.speakers = this.event.speakers.filter(s => s.id !== data.data.id);
      this.event.speakers.push(data.data);
    }
  });
  return await modal.present();
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
            console.log(error);
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
      this.event.participants.push(...data.data);
    }
  });
  return await modal.present();
}

onSaveParticipants() {
  this.newEventStepper.slideNext();
  this.newEventStepper.updateAutoHeight(200);
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
            console.log(error);
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

onRemoveImage(event) {
  this.eventService.removeEventImage(this.event.id, event).subscribe(images => {
    this.event.images.splice(this.event.images.indexOf(event), 1);
    this.appService.presentToast('התמונה הוסרה בהצלחה', true);
  }, error => {
    this.appService.presentToast('חלה תקלה לא ניתן להסיר את התמונה כעת', false);
  });

}

onSaveAndExit() {
  if(this.files.length > 0) {
   this.eventService.uploadEventPhotos(this.files).pipe(
     switchMap( images => {
       return this.eventService.updateEventImages(this.event.id, images);
     }))
   .subscribe(() => {
     this.appService.presentToast('התמונות נוספו בהצלחה', true);
     this.router.navigate(['/manage/events']);
   }, error => {
     console.log(error);
     this.appService.presentToast('חלה תקלה התמונות לא נשמרו', false);
     this.router.navigate(['/manage/events']);
   });
  }
    this.appService.presentToast('האירוע עודכן בהצלחה', true);
    this.pageparamMapSubscription.unsubscribe();
    this.router.navigate(['/manage/events']);
 }


// -------------------------------------------------- Utilities Functions --------------------------------------------------

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    // this.file = imageFile;
    this.form.value.image = imageFile;
  }

  getSpeakerName(speaker: Speaker) {
    return speaker?.title + ' ' + speaker?.firstName + ' ' + speaker?.lastName;
  }

  getParticipantName(participant: Participant) {
    return  participant?.firstName + ' ' + participant?.lastName;
  }

  isEquals(event1: Event, event2: Event) {
    if(
      event1.title === event2.title &&
      event1.description === event2.description &&
      event1.date === event2.date &&
      event1.beginsAt === event2.beginsAt &&
      event1.endsAt === event2.endsAt &&
      event1.thumbnail === event2.thumbnail &&
      event1.maxCapacity === event2.maxCapacity &&
      event1.placeName === event2.placeName &&
      event1.country === event2.country &&
      event1.city === event2.city &&
      event1.street === event2.street &&
      event1.houseNumber === event2.houseNumber &&
      event1.apartment === event2.apartment &&
      event1.entry === event2.entry
    ) {
      return true;
    }
    return  false;
  }


}
