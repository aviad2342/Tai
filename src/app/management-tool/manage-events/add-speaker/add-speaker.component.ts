import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { EventService } from '../../../event/event.service';
import { Speaker } from '../../../event/speaker.model';
import * as utility from '../../../utilities/functions';

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
