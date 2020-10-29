import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Address } from 'src/app/shared/address.model';
import { Therapist } from '../../../therapist/therapist.model';
import { TherapistService } from '../../../therapist/therapist.service';
import * as utility from '../../../utilities/functions';
import { AppService } from '../../../app.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-therapist',
  templateUrl: './edit-therapist.page.html',
  styleUrls: ['./edit-therapist.page.scss'],
})
export class EditTherapistPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  therapist: Therapist;
  isLoading = false;
  treatmentsTypesValid = false;
  admin = false;
  address: Address = new Address();
  selectedImage;
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
          console.log(new Date(value.year.value+'-'+ value.month.value+'-'+ value.day.value).toISOString());
          // const selectedDate = value.year.value+'-'+ value.month.value+'-'+ value.day.value;
          // console.log(selectedDate);
          this.date = new Date(new Date(value.year.value+'-'+ value.month.value+'-'+ value.day.value).toISOString());
        }
      }
    ]
  };

  typesOfTreatments = utility.typesOfTreatments;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private appService: AppService,
    private therapistService: TherapistService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/therapists');
        return;
      }
      this.therapistService.getTherapist(paramMap.get('id')).subscribe(therapist => {
            this.therapist = therapist;
            this.isLoading = false;
            this.treatmentsTypes = this.therapist.treatmentTypes;
            this.address.setAddress(
              this.therapist.country,
              this.therapist.city,
              this.therapist.street,
              this.therapist.houseNumber,
              this.therapist.apartment,
              this.therapist.entry);
            const therapistObj = {
              firstName: this.therapist.firstName,
              lastName: this.therapist.lastName,
              email: this.therapist.email,
              phone: this.therapist.phone,
              password: this.therapist.password,
              date: this.therapist.date,
              resume: this.therapist.resume,
              admin: this.therapist.admin,
              };
              this.date = this.therapist.date;
            this.form.setValue(therapistObj);
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את פרטי המטפל.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/manage/therapists']);
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

  onTreatmentsChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    this.treatmentsTypesValid = false;
    this.therapist.treatmentTypes = [...event.detail.value];
    if(this.therapist.treatmentTypes.length < 1) {
      this.treatmentsTypesValid = true;
    }
  }

  onTreatmentsCancel() {
    if(this.therapist.treatmentTypes.length < 1) {
      this.treatmentsTypesValid = true;
    }
  }

  onAddressPicked(address: Address) {
    this.address = address;
  }

  onAddressIsValid(isValid: boolean) {
    this.addressIsValid = isValid;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if(this.selectedImage) {
      this.therapistService.uploadImage(this.selectedImage, form.value.email)
      .pipe(
        switchMap(uploadRes => {
          const therapistToupdate = new Therapist(
            this.therapist.id,
            form.value.firstName,
            form.value.lastName,
            form.value.password,
            form.value.phone,
            form.value.email,
            this.date,
            this.address.country,
            this.address.city,
            this.address.street,
            this.address.houseNumber,
            this.address.apartment,
            this.address.entry,
            uploadRes.imageUrl,
            this.therapist.treatmentTypes,
            form.value.resume,
            this.form.value.admin
          );
          return this.therapistService.addTherapist(therapistToupdate);
        })
      ).subscribe(() => {
        this.appService.presentToast('המטפל עודכן בהצלחה', true);
        this.router.navigate(['/manage/therapists']);
      }, error => {
        this.appService.presentToast('חלה תקלה פרטי המטפל לא עודכנו', false);
        this.router.navigate(['/manage/therapists']);
      });
    } else {
      const therapistToupdate = new Therapist(
        this.therapist.id,
        form.value.firstName,
        form.value.lastName,
        form.value.password,
        form.value.phone,
        form.value.email,
        this.date,
        this.address.country,
        this.address.city,
        this.address.street,
        this.address.houseNumber,
        this.address.apartment,
        this.address.entry,
        this.therapist.profilePicture,
        this.therapist.treatmentTypes,
        form.value.resume,
        this.form.value.admin
      );
      return this.therapistService.addTherapist(therapistToupdate)
      .subscribe(() => {
        this.appService.presentToast('המטפל עודכן בהצלחה', true);
        this.router.navigate(['/manage/therapists']);
      }, error => {
        this.appService.presentToast('חלה תקלה פרטי המטפל לא עודכנו', false);
        this.router.navigate(['/manage/therapists']);
      });
    }

  }

  onCancel() {
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/therapists']);
  }

}
