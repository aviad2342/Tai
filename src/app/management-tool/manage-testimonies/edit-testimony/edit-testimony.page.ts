import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { Testimony } from '../../../testimony/testimony.model';
import { TestimonyService } from '../../../testimony/testimony.service';
import * as utility from '../../../utilities/functions';

@Component({
  selector: 'app-edit-testimony',
  templateUrl: './edit-testimony.page.html',
  styleUrls: ['./edit-testimony.page.scss'],
})
export class EditTestimonyPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  maxlength = 160;
  testimonyLength = 0;
  file: File;
  imageselected = false;
  imageValid = true;
  testimony: Testimony;
  isLoading = false;
  activeUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public appService: AppService,
    private alertController: AlertController,
    private navController: NavController,
    private testimonyService: TestimonyService,
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/testimonies');
        return;
      }
      this.testimonyService.getTestimony(paramMap.get('id')).subscribe(testimony => {
            this.testimony = testimony;
            const testimonyObj = {
              firstName: this.testimony.firstName,
              lastName:  this.testimony.lastName,
              content:   this.testimony.content,
              approved:  this.testimony.approved,
              };
              this.form.setValue(testimonyObj);
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את העדות.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/manage/testimonies');
                      }
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
            }
          }
        );
    });
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

    if (!form.valid) {
      return;
    }

    if (this.imageselected && !this.file) {
      this.imageValid = false;
      return;
    }

    if (this.imageselected) {
      this.testimonyService.uploadImage(this.file, 'testimony')
    .pipe(
      switchMap(uploadRes => {
        const testimonyToUpdate = new Testimony(
          this.testimony.id,
          form.value.firstName,
          form.value.lastName,
          this.testimony.date,
          form.value.content,
          uploadRes.imageUrl,
          form.value.approved
        );
        return this.testimonyService.updateTestimony(testimonyToUpdate);
      })
    ).subscribe(() => {
      this.appService.presentToast('העדות עודכנה בהצלחה', true);
      this.navController.navigateBack('/manage/testimonies');
      form.reset();
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי העדות לא נשמרו', false);
    });
    } else {
      const testimonyToUpdate = new Testimony(
        this.testimony.id,
        form.value.firstName,
        form.value.lastName,
        this.testimony.date,
        form.value.content,
        this.testimony.picture,
        form.value.approved
      );
      return this.testimonyService.updateTestimony(testimonyToUpdate).subscribe(() => {
        this.appService.presentToast('העדות עודכנה בהצלחה', true);
        this.navController.navigateBack('/manage/testimonies');
        form.reset();
      }, error => {
        this.appService.presentToast('חלה תקלה פרטי העדות לא נשמרו', false);
      });
    }
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/testimonies');
  }

}
