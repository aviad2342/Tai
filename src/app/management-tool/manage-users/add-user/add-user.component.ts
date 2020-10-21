import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Address } from '../../../shared/address.model';
import { AppService } from '../../../app.service';
import { UserService } from '../../../user/user.service';
import { User } from '../../../user/user.model';



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
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;

  countries: string[] = [];
  selectCountry: string;
  hideList = false;
  address: Address = new Address();
  userImage = '../../../assets/images/user-default-image.png';
  file: File;
  addressIsValid = false;
  imageIsValid = true;
  date = new Date();
  pickerOptions = {
    // cssClass: 'ion-justify-content-start',
    // buttons: [
    //   {
    //     text: 'ביטול',
    //     role: 'cancel',
    //     cssClass: 'ion-justify-content-start'
    //   },
    //   {
    //     text: 'אישור',
    //     role: 'confirm',
    //     cssClass: 'ion-justify-content-start',
    //     handler: (value: any) => {
    //       console.log(value);
    //       this.date = value;
    //     }
    //   }
    // ]
  };


  constructor(
    private userService: UserService,
    public appService: AppService,
    private modalController: ModalController
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
    this.userService.uploadImage(this.form.value.image, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const userToAdd = new User(
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
          uploadRes.imageUrl
        );
        return this.userService.addUser(userToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.close();
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
      this.close();
    }
    );
  }

  async close() {
    await this.modalController.dismiss();
  }


}
