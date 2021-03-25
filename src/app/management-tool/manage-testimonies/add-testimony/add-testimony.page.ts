import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonTextarea, ModalController, NavController } from '@ionic/angular';
import { switchMap, timeout } from 'rxjs/operators';
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
  maxlength = 160;
  testimonyLength = 0;
  file: File;
  imageselected = false;
  imageValid = true;


  constructor(
    private testimonyService: TestimonyService,
    public appService: AppService,
    private navController: NavController,
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

  onTestimonyType(event: any) {
    this.testimonyLength = event.detail.value.length;
  }


  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid) {
      return;
    }
    if (!this.imageselected) {
      this.imageValid = false;
      return;
    }
    if (!this.file) {
      this.imageValid = false;
      return;
    }
    this.testimonyService.uploadImage(this.file, 'testimony')
    .pipe(
      switchMap(uploadRes => {
        const testimonyToAdd = new Testimony(
          null,
          form.value.firstName,
          form.value.lastName,
          new Date(),
          form.value.content,
          uploadRes.imageUrl,
          true
        );
        return this.testimonyService.addTestimony(testimonyToAdd);
      })
    ).subscribe(() => {
      this.appService.presentToast('העדות נשמרה בהצלחה', true);
      this.navController.navigateBack('/manage/testimonies');
      form.reset();
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי העדות לא נשמרו', false);
    }
    );
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/testimonies');
  }
}
