import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { Address } from '../shared/address.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import * as utility from '../utilities/functions';
import { Registered } from './registered.model';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  file: File;
  address: Address = new Address();
  addressIsValid = false;
  imageIsValid = true;

  constructor(
    private router: Router,
    private navController: NavController,
    private registrationService: RegistrationService,
    public appService: AppService
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
    if (!this.file) {
      this.imageIsValid = false;
      return;
    }
    this.registrationService.uploadImage(this.file, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const userToRegister = new Registered(
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
          new Date(),
          null,
          null,
          false,
          false
        );
        return this.registrationService.registerUser(userToRegister);
      })
    ).subscribe(() => {
      this.appService.presentToast('נרשמת בהצלחה, מייל ישלח אליך להפעלת החשבון.', true);
      this.navController.navigateBack('/auth');
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה ההרשמה נכשלה!', false);
    }
    );
  }

}
