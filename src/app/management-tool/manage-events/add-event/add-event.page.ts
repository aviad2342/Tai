import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Event } from 'src/app/event/event.model';
import { EventService } from 'src/app/event/event.service';
import { Speaker } from 'src/app/event/speaker.model';
import { Address } from 'src/app/shared/address.model';
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

  @ViewChild('f', { static: true }) form: NgForm;
  countries: string[] = [];
  selectCountry: string;
  speakers: Speaker[] = [];
  hideList = false;
  address: Address = new Address();
  userImage = '../../../assets/images/user-default-image.png';
  file: File;
  date = new Date();
  beginsAt = new Date();
  endsAt = new Date();
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
          this.date = value;
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
          this.beginsAt = value;
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
          this.endsAt = value;
        }
      }
    ]
  };

  constructor(
    private eventService: EventService,
    private modalController: ModalController,
    public appService: AppService
    ) { }

  ngOnInit() {
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

  getName(speaker: Speaker) {
    return speaker?.title + ' ' + speaker?.firstName + ' ' + speaker?.lastName;
  }

  onAddressPicked(address: Address) {
    this.address = address;
  }

  async onAddSpeaker() {
    const modal = await this.modalController.create({
      component: AddSpeakerComponent,
      cssClass: 'add-speaker-modal',
      animated: true,
      backdropDismiss: false,
    });
     modal.onDidDismiss<Speaker>().then( data => {
      if(data.data !== null  && data.data ) {
        this.speakers.push(data.data);
      }
    });
    return await modal.present();
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      return;
    }
    this.eventService.uploadEventThumbnail(this.form.value.image, form.value.email)
    .pipe(
      switchMap(uploadRes => {
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
          [],
          this.speakers
        );
        return this.eventService.addEvent(eventToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('האירוע נשמר בהצלחה', true);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי האירוע לא נשמרו', false);
    }
    );
  }

}
