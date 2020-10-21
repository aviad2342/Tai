import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { NgForm } from '@angular/forms';
import { AlertController, IonSegment, IonSlides, ModalController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';
import { EventService } from '../../../event/event.service';
import { Participant } from '../../../event/participant.model';
import { User } from '../../../user/user.model';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../../app.service';

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
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss'],
})
export class AddParticipantComponent implements OnInit {

  @Input() eventId: string;
  @ViewChild('addParticipant') AddParticipantSlides: IonSlides;
  @ViewChild('addFromSegment') segment: IonSegment;
  @ViewChild('f', { static: true }) form: NgForm;
  users: User[];
  participants: Participant[] = [];
  file: File;

  slideOpts = {
    allowSlidePrev: true,
    allowTouchMove: true
  };


  constructor(
    private eventService: EventService,
    private appService: AppService,
    private alertController: AlertController,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.eventService.getUsersListToAdd(this.eventId).subscribe(users => {
      this.users = users;
    });
  }

  onAddMethodChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'addFromList') {
      this.AddParticipantSlides.slideTo(0);
    } else {
      this.AddParticipantSlides.slideTo(1);
    }
  }

  onAddParticipant(user: User) {
    const participantToAdd = new Participant(
      user.id,
      user.firstName,
      user.lastName,
      user.phone,
      user.email,
      user.profilePicture,
      this.eventId
    )
    this.eventService.addParticipant(participantToAdd).subscribe(participant => {
      this.participants.push(participantToAdd);
      this.users = this.users.filter(u => u.id !== user.id);
    }, error => {
      this.appService.presentToast('חלה תקלה הוספת הנואם בוטלה!', false);
    } );
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
        this.appService.presentToast('חלה תקלה לא ניתן לשמור את התמונה!', false);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.file = imageFile;
    this.form.value.image = imageFile;

  }

  getUserFullName(user: User) {
    return user.firstName + ' ' + user.lastName;
  }

  onDoneAdding() {
    if(this.segment.value === 'addFromList') {
      if(this.participants) {
        this.close(this.participants);
    } else  {
      this.close(null);
    }
    } else  {
      this.onSubmit(this.form);
    }
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      this.onEmptyExit();
      return;
    }
    this.eventService.uploadParticipantPicture(this.form.value.image, 'Participant')
    .pipe(
      switchMap(uploadRes => {
      const participantToAdd = new Participant(
        uuidv4(),
        form.value.firstName,
        form.value.lastName,
        form.value.phone,
        form.value.email,
        uploadRes.imageUrl,
        this.eventId
      );
      return this.eventService.addParticipant(participantToAdd);
    })).subscribe(participant => {
      this.participants.push(participant);
      form.reset();
      this.appService.presentToast('הנואם נשמר בהצלחה', true);
      this.close(this.participants);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי הנואם לא נשמרו', false);
      this.close(null);
    } );
  }

  async onEmptyExit() {
    const alert = await this.alertController.create({
      cssClass: 'delete-lesson-alert',
      header: 'סיום ללא הוספת משתתף',
      message: `האם ברצונך לצאת ללא הוספת משתתף?`,
      mode: 'ios',
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'delete-lesson-alert-btn-cancel',
          handler: () => {
          }
        }, {
          text: 'יציאה',
          handler: () => {
          this.close(null);
          }
        }
      ]
    });
    await alert.present();
  }

  async close(participants: Participant[]) {
    await this.modalController.dismiss(participants);
  }

}
