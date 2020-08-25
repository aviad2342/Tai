import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/user/user.model';
import { ModalController, AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { UserService } from 'src/app/user/user.service';
import { Address } from 'src/app/shared/address.model';


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
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {

  @Input() id: string;
  @ViewChild('f', { static: true }) form: NgForm;
  user: User;
  address: Address = new Address();
  updateImage = false;


  constructor(
    private userService: UserService,
    public appService: AppService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.userService.getUser(this.id).subscribe(user => {
      this.user = user;
      this.address.setAddress(this.user.country,
        this.user.city,
        this.user.street,
        this.user.houseNumber,
        this.user.apartment,
        this.user.entry);
      const userObj = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        password: this.user.password,
        date: this.user.date,
        };
      this.form.setValue(userObj);
    },
    error => {
      this.alertController
        .create({
          header: 'An error ocurred!',
          message: 'Could not load place.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.close(false);
              }
            }
          ]
        })
        .then(alertEl => alertEl.present());
    }
  );
  }

  onImagePicked(imageData: string | File) {
    this.updateImage = true;
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
    this.form.value.image = imageFile;
  }

  onAddressPicked(address: Address) {
    this.address = address;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (form.value.image) {
      this.userService.uploadImage(form.value.image, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const userToUpdate = new User(
          this.id,
          form.value.firstName,
          form.value.lastName,
          form.value.password,
          form.value.phone,
          form.value.email,
          new Date(form.value.date),
          this.address.country,
          this.address.city,
          this.address.street,
          this.address.houseNumber,
          this.address.apartment,
          this.address.entry,
          uploadRes.imageUrl
        );
        return this.userService.updateUser(userToUpdate);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.close(true);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
      this.close(false);
    });

    } else {
      const userToUpdate = new User(
        this.id,
        form.value.firstName,
        form.value.lastName,
        form.value.password,
        form.value.phone,
        form.value.email,
        new Date(form.value.date),
        this.address.country,
        this.address.city,
        this.address.street,
        this.address.houseNumber,
        this.address.apartment,
        this.address.entry,
        this.user.profilePicture
      );
      this.userService.updateUser(userToUpdate).subscribe(() => {
        form.reset();
        this.appService.presentToast('המשתמש נשמר בהצלחה', true);
        this.close(true);
      }, error => {
        form.reset();
        this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
        this.close(false);
      });
    }

  }

  async close(didUpdate: boolean) {
    await this.modalController.dismiss({didUpdate});
  }

}
