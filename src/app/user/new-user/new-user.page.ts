import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { Address } from '../../shared/address.model';
import { AppService } from '../../app.service';
import { NavController } from '@ionic/angular';


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
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;

  countries: string[] = [];
  selectCountry: string;
  hideList = false;
  address: Address = new Address();
  userImage = '../../../assets/images/user-default-image.png';
  file: File;
  imageIsValid = true;


  constructor(
    private router: Router,
    private userService: UserService,
    private navController: NavController,
    public appService: AppService
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
        console.log(error);
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
      form.reset();
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.navController.navigateBack('/tabs/user');
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
      this.navController.navigateBack('/tabs/user');
    }
    );
  }

}
