import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AlertController, IonIcon, IonInput } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Therapist } from '../../../therapist/therapist.model';
import { AppService } from '../../../app.service';
import { Address } from '../../../shared/address.model';
import { TherapistService } from '../../../therapist/therapist.service';
import { Router } from '@angular/router';
import * as utility from '../../../utilities/functions';

@Component({
  selector: 'app-add-therapist',
  templateUrl: './add-therapist.page.html',
  styleUrls: ['./add-therapist.page.scss'],
})
export class AddTherapistPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;

  treatmentsTypesValid = false;
  admin = false;
  address: Address = new Address();
  file: File;
  addressIsValid = false;
  imageIsValid = true;
  date = new Date();
  treatmentsTypes: string[] = [];
  treatmentsTypesSelectOptions = {
    backdropDismiss: false,
    cssClass: 'select-types-alert',
    header: 'בחר סוגי טיפול מהרשימה'
  };

  typesOfTreatments = utility.typesOfTreatments;

  // typesOfTreatments = {
  //   BOOKS: 'ספרים',
  //   TREATMENTS: 'טיפולים',
  //   CONFERENCES: 'כנסים',
  //   COURSES: 'קורסים',
  //   ARTICLES: 'מאמרים',
  //   ACCESSORIES: 'אביזרים',
  //   OTHER: 'אחר'
  // };

  constructor(
    private therapistService: TherapistService,
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
    this.file = imageFile;
    this.form.value.image = imageFile;

  }

  onTreatmentsChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.treatmentsTypesValid = false;
    this.treatmentsTypes = [...event.detail.value];
    console.log(this.form.value.admin);
  }

  onTreatmentsCancel() {
    this.treatmentsTypesValid = true;
  }

  onAddressPicked(address: Address) {
    this.address = address;
  }

  onAddressIsValid(isValid: boolean) {
    this.addressIsValid = isValid;
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid) {
      return;
    }
    if (!this.form.value.image) {
      this.imageIsValid = false;
      return;
    }
    this.therapistService.uploadImage(this.form.value.image, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const therapistToAdd = new Therapist(
          null,
          form.value.firstName,
          form.value.lastName,
          form.value.password,
          form.value.phone,
          form.value.email,
          form.value.date,
          this.address.country,
          this.address.city,
          this.address.street,
          this.address.houseNumber,
          this.address.apartment,
          this.address.entry,
          uploadRes.imageUrl,
          this.treatmentsTypes,
          form.value.resume,
          this.form.value.admin
        );
        return this.therapistService.addTherapist(therapistToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המטפל נשמר בהצלחה', true);
      this.router.navigate(['/manage/therapists']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המטפל לא נשמרו', false);
      this.router.navigate(['/manage/therapists']);
    }
    );
  }

  togglePasswordVisibility(input: IonInput, icon: IonIcon) {
    if(input.type === 'password') {
      input.type = 'text';
      icon.name = 'eye-outline';
    } else {
      input.type = 'password';
      icon.name = 'eye-off-outline'
    }
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/therapists']);
  }

}
