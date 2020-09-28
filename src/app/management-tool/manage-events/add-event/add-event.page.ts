import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Participant } from 'src/app/event/participant.model';
import { AppService } from '../../../app.service';
import { Event } from '../../../event/event.model';
import { EventService } from '../../../event/event.service';
import { Speaker } from '../../../event/speaker.model';
import { Address } from '../../../shared/address.model';
import { AddParticipantComponent } from '../add-participant/add-participant.component';
import { AddSpeakerComponent } from '../add-speaker/add-speaker.component';


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
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {

  @ViewChild('stepper') newEventStepper: IonSlides;
  @ViewChild('f', { static: true }) form: NgForm;
  event: Event;
  eventId: string;
  files: File[] = [];
  speakers: Speaker[] = [];
  participants: Participant[] = [];
  hideList = false;
  address: Address = new Address();
  userImage = '../../../assets/images/user-default-image.png';
  file: File;
  now = new Date().toISOString();
  date: Date;
  beginsAt: Date;
  endsAt = new Date();

  slideOpts = {
    allowSlidePrev: false,
    allowTouchMove: false,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    },
    renderProgressbar (progressbarFillClass) {
      return '<span class="' + progressbarFillClass + '"></span>';
  }
  };

  pickerOptions = {
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
          console.log(value);
          this.date = new Date(value.year.value+'-'+ value.month.value+'-'+ value.day.value);
          console.log(this.date);
        }
      }
    ]
  };

  beginsAtpickerOptions = {
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
    this.beginsAt = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), value.hour.value, value.minute.value,0 ,0);
          console.log(this.beginsAt);
        }
      }
    ]
  };

  endsAtpickerOptions = {
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
      this.endsAt = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), value.hour.value, value.minute.value,0 ,0);
        }
      }
    ]
  };

  constructor(
    private eventService: EventService,
    private modalController: ModalController,
    private router: Router,
    public appService: AppService
    ) { }

  ngOnInit() {
    this.slideOpts.renderProgressbar('progressbarClass');
  }


  goto() {
    this.newEventStepper.slideTo(2);
  }
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
    this.file = imageFile;
    this.form.value.image = imageFile;

  }

  onAddressPicked(address: Address) {
    this.address = address;
  }

  async onAddSpeaker() {
    const modal = await this.modalController.create({
      component: AddSpeakerComponent,
      cssClass: 'add-speaker-modal',
      animated: true,
      backdropDismiss: false
    });
     modal.onDidDismiss<Speaker>().then( data => {
      if(data.data !== null  && data.data ) {
        this.speakers.push(data.data);
        console.log(this.speakers);
      }
    });
    return await modal.present();
  }

  async onAddParticipant() {
    const modal = await this.modalController.create({
      component: AddParticipantComponent,
      cssClass: 'add-participant-modal',
      animated: true,
      backdropDismiss: false
    });
     modal.onDidDismiss<Participant>().then( data => {
      if(data.data !== null  && data.data ) {
        this.participants.push(data.data);
        console.log(this.speakers);
      }
    });
    return await modal.present();
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      return;
    }
    this.eventService.uploadEventThumbnail(this.form.value.image, 'Event')
    .pipe(
      switchMap(uploadRes => {
        console.log(this.speakers);
        const eventToAdd = new Event(
          null,
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
          'cc11',
          [],
          [],
          []
        );
        console.log(eventToAdd);
        return this.eventService.addEvent(eventToAdd);
      })
    ).subscribe(newEvent => {
      this.event = newEvent;
      form.reset();
      this.appService.presentToast('האירוע נשמר בהצלחה', true);
      this.newEventStepper.slideNext();
    }, error => {
      console.log(error);
      this.appService.presentToast('חלה תקלה פרטי האירוע לא נשמרו', false);
    }
    );
  }

  onFilesAdded(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSaveSpeakers() {
    this.newEventStepper.slideNext();
  }

  onSaveParticipants() {
    this.newEventStepper.slideNext();
  }

 onSaveAndExit() {
   if(this.files) {
    this.eventService.uploadEventPhotos(this.files).subscribe(() => {
      this.appService.presentToast('התמונות נוספו בהצלחה', true);
      this.router.navigate(['/manage/events']);
    }, error => {
      console.log(error);
      this.appService.presentToast('חלה תקלה התמונות לא נשמרו', false);
      this.router.navigate(['/manage/events']);
    });
   }
   this.appService.presentToast('סיימת בהצלחה את יצירת האירוע', true);
      this.router.navigate(['/manage/events']);
  }

  getSpeakerName(speaker: Speaker) {
    return speaker?.title + ' ' + speaker?.firstName + ' ' + speaker?.lastName;
  }

  getParticipantName(participant: Participant) {
    return  participant?.firstName + ' ' + participant?.lastName;
  }

}
