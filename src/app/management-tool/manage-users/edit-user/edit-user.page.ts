import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonIcon, IonInput, NavController } from '@ionic/angular';
import { AppService } from '../../../app.service';
import { User } from '../../../user/user.model';
import { UserService } from '../../../user/user.service';
import { Address } from '../../../shared/address.model';
import * as utility from '../../../utilities/functions';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  user: User;
  activeUrl = '';
  isLoading = false;
  addressIsValid = false;
  address: Address = new Address();
  imageselected = false;
  updateImage: File;;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public appService: AppService,
    private alertController: AlertController,
    private userService: UserService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/users');
        return;
      }
      this.userService.getUser(paramMap.get('id')).subscribe(user => {
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
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המשתמש.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/manage/users');
                      }
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
            }
          }
        );
    });
  }

  onImagePicked(imageData: string | File) {
    this.imageselected = true;
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
    this.updateImage = imageFile;
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
    if (this.imageselected && this.updateImage) {
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
    ).subscribe(user => {
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
      this.navController.navigateBack('/manage/users');
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
      this.navController.navigateBack('/manage/users');
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

      if(this.isEquals(this.user, userToUpdate)) {
        this.appService.presentToast('המשתמש נשמר בהצלחה', true);
        this.navController.navigateBack('/manage/users');
        return;
      }
      this.userService.updateUser(userToUpdate).subscribe(user => {
        this.appService.presentToast('המשתמש נשמר בהצלחה', true);
        this.navController.navigateBack('/manage/users');
      }, error => {
        this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
      });
    }

  }

  isEquals(user1: User, user2: User) {
    if(
      user1.firstName           === user2.firstName &&
      user1.lastName            === user2.lastName &&
      user1.date                === user2.date &&
      user1.password            === user2.password &&
      user1.phone               === user2.phone &&
      user1.email               === user2.email &&
      user1.date                === user2.date && // compare dates
      user1.address.country     === user2.address.country &&
      user1.address.city        === user2.address.city &&
      user1.address.street      === user2.address.street &&
      user1.address.houseNumber === user2.address.houseNumber &&
      user1.address.apartment   === user2.address.apartment &&
      user1.address.entry       === user2.address.entry
    ) {
      return true;
    }
    return  false;
  }

  onCancel() {
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/users');
  }

}
