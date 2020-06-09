import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { UserService } from '../user.service';
import { User } from '../user.model';
import { Subscription } from 'rxjs';
import { Address } from '../../shared/address.model';



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
  updateImage = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private navCtrl: NavController,
    private router: Router
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
          country: this.user.country,
          city: this.user.city,
          street: this.user.street,
          houseNumber: this.user.houseNumber,
          apartment: this.user.apartment,
          entry: this.user.entry
          };
        // this.form.value.firstName = this.user.firstName;
        this.form.setValue(userObj);
        // this.form.value.email = this.user.email;
        // this.form.value.phone = this.user.phone;
        // this.form.value.password = this.user.password;
        // this.form.value.dateOfBirth = this.user.date;
        // this.form.value.country = this.user.country;
        // this.form.value.city = this.user.city;
        // this.form.value.street = this.user.street;
        // this.form.value.houseNumber = this.user.houseNumber;
        // this.form.value.apartment = this.user.apartment;
        // this.form.value.entry = this.user.entry;
        // this.form.value.imageUrl = this.user.profilePicture;
        console.log(this.user);
      });
    });
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
    console.log(this.updateImage);
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
          form.value.country,
          form.value.city,
          form.value.street,
          form.value.houseNumber,
          form.value.apartment,
          form.value.entry,
          uploadRes.imageUrl
        );
        return this.userService.updateUser(userToUpdate);
      })
    ).subscribe(() => {
      form.reset();
      this.router.navigate(['/tabs/user']);
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
        form.value.country,
        form.value.city,
        form.value.street,
        form.value.houseNumber,
        form.value.apartment,
        form.value.entry,
        this.user.profilePicture
      );
      this.userService.updateUser(userToUpdate).subscribe(() => {
        form.reset();
        this.router.navigate(['/tabs/user']);
      });
    }

  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
