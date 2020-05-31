import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { NgForm } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../user.model';
import { Router } from '@angular/router';


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
  // startDate: string  = new Date('2015-12-02').toISOString();
  autocompleteItems: string[];
  autocomplete = { input: '' };
  countries: string[] = [];
  selectCountry: string;
  hideList = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
    ) { }

  ngOnInit() {
    // new Intl.DateTimeFormat('he-IL').format(this.startDate);
  }
  updateSearchResults() {
    this.hideList = false;
    this.getCountriesAutocomplete(this.autocomplete.input);
  }

  getCountriesAutocomplete(country: string) {
    return this.userService.getCountries(country).subscribe(countries => {
      this.countries = countries;
      console.log(countries);
    });
  }

  selectCountryResult(country) {
    this.selectCountry = country;
    this.autocomplete.input = this.selectCountry;
    this.hideList = true;
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
    this.form.value.image = imageFile;
  }

  onSubmit(form: NgForm) {
    if (!form.valid || !form.value.image) {
      return;
    }
    this.userService.uploadImage(form.value.image, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const userToAdd = new User(
          null,
          form.value.firstName,
          form.value.lastName,
          form.value.email,
          form.value.phone,
          form.value.password,
          new Date(form.value.dateOfBirth),
          form.value.country,
          form.value.city,
          form.value.street,
          form.value.houseNumber,
          form.value.apartment,
          form.value.entry,
          uploadRes.imageUrl
        );
        return this.userService.addUser(userToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.router.navigate(['/tabs/user']);
    });
  }


}
