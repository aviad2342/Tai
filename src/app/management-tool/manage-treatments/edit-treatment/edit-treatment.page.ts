import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AppService } from '../../../app.service';
import { Treatment } from '../../../treatment/treatment.model';
import { TreatmentService } from '../../../treatment/treatment.service';
import * as utility from '../../../utilities/functions';
import { Therapist } from '../../../therapist/therapist.model';
import { switchMap } from 'rxjs/operators';
import { AddTherapistComponent } from '../add-therapist/add-therapist.component';

@Component({
  selector: 'app-edit-treatment',
  templateUrl: './edit-treatment.page.html',
  styleUrls: ['./edit-treatment.page.scss'],
})
export class EditTreatmentPage implements OnInit {

  treatment: Treatment;
  @ViewChild('f', { static: true }) form: NgForm;
  updateImage;
  isLoading = false;
  treatmentType = '';
  therapistName = '';
  therapistPicture = '';
  therapist: Therapist;
  typesOfTreatments = utility.typesOfTreatments;
  treatmentsTypesSelectOptions = {
    backdropDismiss: false,
    cssClass: 'select-types-alert',
    header: 'בחר סוג טיפול מהרשימה'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private modalController: ModalController,
    private treatmentService: TreatmentService,
    public appService: AppService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/treatments');
        return;
      }
      this.treatmentService.getTreatment(paramMap.get('id')).subscribe(treatment => {
            this.treatment = treatment;
            this.isLoading = false;
            this.treatmentType = treatment.treatmentType;
            this.therapistName = treatment.therapistName;
            this.therapistPicture = treatment.therapistProfilePicture;
            const treatmentObj = {
              description: this.treatment.description
              };
            this.form.setValue(treatmentObj);
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את הטיפול.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.navController.navigateBack('/manage/treatments');
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
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

  onTreatmentTypeChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.treatmentType = event.detail.value;
  }

  async onSelecteTherapist() {
    const modal = await this.modalController.create({
      component: AddTherapistComponent,
      cssClass: 'add-therapist-modal',
      animated: true,
      backdropDismiss: false,
      componentProps: {
        treatmentType: this.treatmentType
      }
    });
     modal.onDidDismiss<Therapist>().then( data => {
      if(data.data !== null  && data.data ) {
        this.treatment.therapistId = data.data.id;
        this.treatment.therapistName = data.data.firstName + ' ' + data.data.lastName;
        this.treatment.therapistProfilePicture = data.data.profilePicture;
      }
    });
    return await modal.present();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (this.updateImage) {
      this.treatmentService.uploadTreatmentThumbnail(this.updateImage, 'Treatment')
      .pipe(
        switchMap(uploadRes => {
          const treatmentUpdate = new Treatment(
            this.treatment.id,
            this.treatmentType,
            form.value.description,
            uploadRes.imageUrl,
            this.treatment.catalogNumber,
            this.treatment.therapistId,
            this.treatment.therapistName,
            this.treatment.therapistProfilePicture
          );
          return this.treatmentService.updateTreatment(treatmentUpdate);
        })
      ).subscribe(() => {
        form.reset();
        this.appService.presentToast('הטיפול עודכן בהצלחה', true);
        this.navController.navigateBack('/manage/treatments');
      }, error => {
        form.reset();
        this.appService.presentToast('חלה תקלה פרטי הטיפול לא נשמרו', false);
        this.navController.navigateBack('/manage/treatments');
      });
    } else {
      const treatmentUpdate = new Treatment(
        this.treatment.id,
        this.treatmentType,
        form.value.description,
        this.treatment.thumbnail,
        this.treatment.catalogNumber,
        this.treatment.therapistId,
        this.treatment.therapistName,
        this.treatment.therapistProfilePicture
      );
      return this.treatmentService.updateTreatment(treatmentUpdate)
      .subscribe(() => {
        form.reset();
        this.appService.presentToast('הטיפול עודכן בהצלחה', true);
        this.navController.navigateBack('/manage/treatments');
      }, error => {
        form.reset();
        this.appService.presentToast('חלה תקלה פרטי הטיפול לא נשמרו', false);
        this.navController.navigateBack('/manage/treatments');
      });
    }
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/treatments');
  }

}
