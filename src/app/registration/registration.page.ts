import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { Address } from '../shared/address.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import * as utility from '../utilities/functions';

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
    private userService: UserService,
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
    this.userService.uploadImage(this.file, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const userToAdd = new User(
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
          uploadRes.imageUrl
        );
        return this.userService.addUser(userToAdd);
      })
    ).subscribe(() => {
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.router.navigate(['/auth']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
    }
    );
  }

}
