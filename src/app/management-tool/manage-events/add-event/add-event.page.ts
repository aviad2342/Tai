import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Event } from 'src/app/event/event.model';
import { EventService } from 'src/app/event/event.service';
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
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  countries: string[] = [];
  selectCountry: string;
  hideList = false;
  address: Address = new Address();
  userImage = '../../../assets/images/user-default-image.png';
  file: File;
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
    private eventService: EventService,
    public appService: AppService
    ) { }

  ngOnInit() {
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
    this.file = imageFile;
    this.form.value.image = imageFile;

  }

  onAddressPicked(address: Address) {
    this.address = address;
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      return;
    }
    this.eventService.uploadEventThumbnail(this.form.value.image, form.value.email)
    .pipe(
      switchMap(uploadRes => {
        const eventToAdd = new Event(
          null,
          form.value.firstName,
          form.value.lastName,
          form.value.password,
          new Date(form.value.dateOfBirth),
          form.value.phone,
          form.value.email,
          form.value.email,
          this.address.entry,
          this.address.country,
          this.address.city,
          this.address.street,
          this.address.houseNumber,
          this.address.apartment,
          uploadRes.imageUrl,
          form.value.email,
          form.value.email
        );
        return this.eventService.addEvent(eventToAdd);
      })
    ).subscribe(() => {
      form.reset();
      this.appService.presentToast('המשתמש נשמר בהצלחה', true);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המשתמש לא נשמרו', false);
    }
    );
  }

}
