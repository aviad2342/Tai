import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AlertController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { Therapist } from '../../../therapist/therapist.model';
import { AppService } from '../../../app.service';
import { Address } from '../../../shared/address.model';
import { TherapistService } from '../../../therapist/therapist.service';
import { Router } from '@angular/router';

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
  selector: 'app-add-therapist',
  templateUrl: './add-therapist.page.html',
  styleUrls: ['./add-therapist.page.scss'],
})
export class AddTherapistPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;

  countries: string[] = [];
  selectCountry: string;
  hideList = false;
  treatmentsTypesValid = false;
  address: Address = new Address();
  userImage = '../../../assets/images/user-default-image.png';
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

  pickerOptions = {
    mode: 'ios',
    cssClass: 'date-picker-class',
    backdropDismiss: false,
    buttons: [
      {
        text: 'ביטול',
        role: 'cancel',
        cssClass: 'picker-cancel-btn'
      },
      {
        text: 'אישור',
        role: 'confirm',
        cssClass: 'picker-confirm-btn',
        handler: (value: any) => {
          this.date = new Date(value.year.value+'-'+ value.month.value+'-'+ value.day.value);
        }
      }
    ]
  };

  typesOfTreatments = {
    BOOKS: 'ספרים',
    TREATMENTS: 'טיפולים',
    CONFERENCES: 'כנסים',
    COURSES: 'קורסים',
    ARTICLES: 'מאמרים',
    ACCESSORIES: 'אביזרים',
    OTHER: 'אחר'
  };

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

  onTreatmentsChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.treatmentsTypesValid = false;
    this.treatmentsTypes = [...event.detail.value];
    console.log(this.treatmentsTypes);
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
          new Date(form.value.dateOfBirth),
          this.address.country,
          this.address.city,
          this.address.street,
          this.address.houseNumber,
          this.address.apartment,
          this.address.entry,
          uploadRes.imageUrl,
          this.treatmentsTypes,
          form.value.resume,
          false
        );
        return this.therapistService.addTherapist(therapistToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.router.navigate(['/manage/therapists']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
      this.router.navigate(['/manage/therapists']);
    }
    );
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/therapists']);
  }

}
