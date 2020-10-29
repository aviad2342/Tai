import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { EventService } from '../../../event/event.service';
import { Speaker } from '../../../event/speaker.model';
import * as utility from '../../../utilities/functions';

@Component({
  selector: 'app-edit-speaker',
  templateUrl: './edit-speaker.component.html',
  styleUrls: ['./edit-speaker.component.scss'],
})
export class EditSpeakerComponent implements OnInit {


  @Input() speaker: Speaker;
  @ViewChild('f', { static: true }) form: NgForm;
  updateImage;
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

  ngOnInit() {
    const speakerObj = {
      title:       this.speaker?.title,
      firstName:   this.speaker?.firstName,
      lastName:    this.speaker?.lastName,
      description: this.speaker?.description,
      };
      setTimeout(() => {
        this.form.setValue(speakerObj);
      });
  }

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
    this.updateImage = imageFile;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (this.updateImage) {
    this.eventService.uploadSpeakerPicture(this.updateImage, 'Speaker')
    .pipe(
      switchMap(uploadRes => {
        const speakerToAdd = new Speaker(
          this.speaker.id,
          form.value.title,
          form.value.firstName,
          form.value.lastName,
          form.value.description,
          uploadRes.imageUrl,
          this.speaker.event
        );
        return this.eventService.updateSpeakerAndImage(speakerToAdd);
      })
    ).subscribe(newSpeaker => {
      this.appService.presentToast('הנואם עודכן בהצלחה', true);
      this.close(newSpeaker);
      this.form.reset();
    }, error => {
      this.form.reset();
      this.appService.presentToast('חלה תקלה עדכון הנואם נכשל! נסה שנית מאוחר יותר', false);
      this.close(null);
    }
    );
  } else {
    const speakerToAdd = new Speaker(
      this.speaker.id,
      form.value.title,
      form.value.firstName,
      form.value.lastName,
      form.value.description,
      this.speaker.picture,
      this.speaker.event
    );
    if(this.isEquals(this.speaker, speakerToAdd)) {
      this.appService.presentToast('הנואם עודכן בהצלחה', true);
      this.close(null);
      return;
    }
    return this.eventService.updateSpeaker(speakerToAdd).subscribe(newSpeaker => {
      this.form.reset();
      this.appService.presentToast('הנואם עודכן בהצלחה', true);
      this.close(newSpeaker);
    }, error => {
      this.form.reset();
      this.appService.presentToast('חלה תקלה עדכון הנואם נכשל! נסה שנית מאוחר יותר', false);
      this.close(null);
    });
  }
  }


  async close(speaker: Speaker) {
    await this.modalController.dismiss(speaker);
  }

  isEquals(speaker1: Speaker, speaker2: Speaker) {
    if(
      speaker1.title       === speaker2.title &&
      speaker1.firstName   === speaker2.firstName &&
      speaker1.lastName    === speaker2.lastName &&
      speaker1.description === speaker2.description
    ) {
      return true;
    }
    return  false;
  }

}
