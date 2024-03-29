import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { Address } from '../../shared/address.model';
import { AppService } from '../../app.service';



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
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit, OnDestroy {

  user: User;
  id: string;
  @ViewChild('f', { static: true }) form: NgForm;
  private userSubscription: Subscription;
  address: Address = new Address();
  updateImage;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    public appService: AppService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/tabs/user');
        return;
      }
      this.id = paramMap.get('id');
      this.userSubscription = this.userService.getUser(paramMap.get('id')).
      subscribe(user => {
        this.user = user;
        this.address.setAddress(
          user.address.id,
          user.address.country,
          user.address.city,
          user.address.street,
          user.address.houseNumber,
          user.address.apartment,
          user.address.entry
          );
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
            header: 'ישנה תקלה!',
                message: 'לא ניתן לערוך את המשתמש.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.navCtrl.navigateBack('/tabs/user');
                }
              }
            ]
          })
          .then(alertEl => alertEl.present());
      });
    });
  }

  onImagePicked(imageData: string | File) {
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
    this.updateImage = imageFile;
  }

  onAddressPicked(address: Address) {
    this.address = address;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (this.updateImage) {
      this.userService.uploadImage(this.updateImage, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const userToUpdate = new User(
          this.user.id,
          form.value.firstName,
          form.value.lastName,
          form.value.password,
          form.value.phone,
          form.value.email,
          form.value.date,
          uploadRes.imageUrl,
          this.address,
          this.user.preferences,
          this.user.savedVideos,
          this.user.cart,
          this.user.orders,
        );
        return this.userService.updateUser(userToUpdate);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.navCtrl.navigateBack('/tabs/user');
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
      this.navCtrl.navigateBack('/tabs/user');
    });

    } else {
      const userToUpdate = new User(
        this.user.id,
        form.value.firstName,
        form.value.lastName,
        form.value.password,
        form.value.phone,
        form.value.email,
        form.value.date,
        this.user.profilePicture,
        this.address,
        this.user.preferences,
        this.user.savedVideos,
        this.user.cart,
        this.user.orders
      );
      this.userService.updateUser(userToUpdate).subscribe(() => {
        form.reset();
        this.appService.presentToast('המשתמש נשמר בהצלחה', true);
        this.navCtrl.navigateBack('/tabs/user');
      }, error => {
        form.reset();
        this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
        this.navCtrl.navigateBack('/tabs/user');
      });
    }

  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
