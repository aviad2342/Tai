import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Testimony } from 'src/app/testimony/testimony.model';
import { TestimonyService } from 'src/app/testimony/testimony.service';
import * as utility from '../../../utilities/functions';

@Component({
  selector: 'app-add-testimony',
  templateUrl: './add-testimony.page.html',
  styleUrls: ['./add-testimony.page.scss'],
})
export class AddTestimonyPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;

  file: File;
  imageselected = false;


  constructor(
    private testimonyService: TestimonyService,
    public appService: AppService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
  }

  onImagePicked(imageData: string | File) {
    this.imageselected = true;
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
  }


  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid) {
      return;
    }
    if (!this.file) {
      this.imageselected = false;
      return;
    }
    this.testimonyService.uploadImage(this.file, 'testimony')
    .pipe(
      switchMap(uploadRes => {
        const testimonyToAdd = new Testimony(
          null,
          form.value.firstName,
          form.value.lastName,
          form.value.date,
          form.value.content,
          uploadRes.imageUrl,
          true
        );
        return this.testimonyService.addTestimony(testimonyToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
    }
    );
  }
}
