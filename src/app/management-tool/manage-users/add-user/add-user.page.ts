import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonIcon, IonInput, NavController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Address } from 'src/app/shared/address.model';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import * as utility from '../../../utilities/functions';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;

  countries: string[] = [];
  selectCountry: string;
  hideList = false;
  address: Address = new Address();
  file: File;
  addressIsValid = false;
  imageIsValid = true;


  constructor(
    private userService: UserService,
    public appService: AppService,
    private navController: NavController
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

  togglePasswordVisibility(input: IonInput, icon: IonIcon) {
    if(input.type === 'password') {
      input.type = 'text';
      icon.name = 'eye-outline';
    } else {
      input.type = 'password';
      icon.name = 'eye-off-outline'
    }
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
          uploadRes.imageUrl,
          this.address
        );
        return this.userService.addUser(userToAdd);
      })
    ).subscribe(() => {
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.navController.navigateBack('/manage/users');
      form.reset();
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
    }
    );
  }

  onCancel() {
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/users');
    this.form.reset();
  }
}
