import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AppService } from '../../../app.service';
import { TreatmentService } from '../../../treatment/treatment.service';
import * as utility from '../../../utilities/functions';
import { Treatment } from '../../../treatment/treatment.model';
import { switchMap } from 'rxjs/operators';
import { Therapist } from '../../../therapist/therapist.model';
import { AddTherapistComponent } from '../add-therapist/add-therapist.component';

@Component({
  selector: 'app-add-treatment',
  templateUrl: './add-treatment.page.html',
  styleUrls: ['./add-treatment.page.scss'],
})
export class AddTreatmentPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  selectedImage;
  treatmentTypeValid = false;
  didSelecteTreatmentType = true;
  imageIsValid = true;
  treatmentType = '';
  therapistPicture = 'http://localhost:3000/Images/user-default-image.png';
  therapistName = '';
  therapist: Therapist;
  typesOfTreatments = utility.typesOfTreatments;
  treatmentsTypesSelectOptions = {
    backdropDismiss: false,
    cssClass: 'select-types-alert',
    header: 'בחר סוג טיפול מהרשימה'
  };

  constructor(
    private treatmentService: TreatmentService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private appService: AppService
    ) { }

  ngOnInit() {
  }

  onImagePicked(imageData: string | File) {
    this.imageIsValid = true;
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
    this.selectedImage = imageFile;
  }

  onTreatmentTypeChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.treatmentTypeValid = false;
    this.treatmentType = event.detail.value;
    this.didSelecteTreatmentType = false;
  }

  onTreatmentCancel(event: CustomEvent<SegmentChangeEventDetail>) {
    if(event || event === null) {
      this.treatmentTypeValid = true;

    }
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
        this.therapist = data.data;
        this.therapistPicture = data.data.profilePicture;
        this.therapistName = data.data.firstName + ' ' + data.data.lastName;
      }
    });
    return await modal.present();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (!this.selectedImage) {
      this.imageIsValid = false;
      return;
    }
    this.treatmentService.uploadTreatmentThumbnail(this.selectedImage, 'Treatment')
    .pipe(
      switchMap(uploadRes => {
        const treatmentToAdd = new Treatment(
          null,
          this.treatmentType,
          form.value.description,
          uploadRes.imageUrl,
          'ff44',
          this.therapist.id,
          this.getTherapistName(),
          this.therapist.profilePicture
        );
        return this.treatmentService.addTreatment(treatmentToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('הטיפול נשמר בהצלחה', true);
      this.router.navigate(['/manage/treatments']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי הטיפול לא נשמרו', false);
      this.router.navigate(['/manage/treatments']);
    }
    );
  }

  getTherapistName() {
    return  this.therapist?.firstName + ' ' + this.therapist?.lastName;
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/treatments']);
  }

}
