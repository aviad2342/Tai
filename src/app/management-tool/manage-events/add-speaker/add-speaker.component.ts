import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { EventService } from '../../../event/event.service';
import { Speaker } from '../../../event/speaker.model';

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
  selector: 'app-add-speaker',
  templateUrl: './add-speaker.component.html',
  styleUrls: ['./add-speaker.component.scss'],
})
export class AddSpeakerComponent implements OnInit {

  @Input() eventId: string;
  @ViewChild('f', { static: true }) form: NgForm;
  file: File;
  titles = [
    'מר',
     'גב\'',
     'ד"ר',
     'פרופ\''
  ];
  customAlertOptions: any = {
    header: 'בחר תואר',
    translucent: true,
    backdropDismiss: false,
  };

  constructor(
    private eventService: EventService,
    private appService: AppService,
    private modalController: ModalController
    ) { }

  ngOnInit() {}

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

  async close(speaker: Speaker) {
    await this.modalController.dismiss(speaker);
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      return;
    }
    this.eventService.uploadSpeakerPicture(this.form.value.image, 'Speaker')
    .pipe
    (switchMap(uploadRes => {
      const speakerToAdd = new Speaker(
        null,
        form.value.title,
        form.value.firstName,
        form.value.lastName,
        form.value.description,
        uploadRes.imageUrl,
        this.eventId
      );
      return this.eventService.addSpeaker(speakerToAdd);
    })).subscribe(speaker => {
      form.reset();
      this.appService.presentToast('הנואם נשמר בהצלחה', true);
       this.close(speaker);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי הנואם לא נשמרו', false);
      this.close(null);
    } );
  }

}
