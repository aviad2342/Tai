import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { NgForm } from '@angular/forms';
import { IonSlides, ModalController } from '@ionic/angular';
import { EventService } from 'src/app/event/event.service';
import { Participant } from 'src/app/event/participant.model';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';

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
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss'],
})
export class AddParticipantComponent implements OnInit {

  @Input() eventId: string;
  @ViewChild('addParticipant') AddParticipantSlides: IonSlides;
  @ViewChild('f', { static: true }) form: NgForm;
  users: User[];
  participants: Participant[] = [];
  file: File;

  slideOpts = {
    allowSlidePrev: true,
    allowTouchMove: true
  };


  constructor(
    private eventService: EventService,
    private userService: UserService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  onAddMethodChosen(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'addFromList') {
      this.AddParticipantSlides.slideTo(0);
    } else {
      this.AddParticipantSlides.slideTo(1);
    }
  }

  onAddParticipant(user: User) {
    const participantToAdd = new Participant(
      user.id,
      user.firstName,
      user.lastName,
      user.phone,
      user.email,
      user.profilePicture,
      this.eventId
    )
    this.participants.push(participantToAdd);
    this.users.splice(this.users.indexOf(user), 1);
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

  getUserFullName(user: User) {
    return user.firstName + ' ' + user.lastName;
  }

  onDoneAdding() {
    if(this.participants) {
      this.close(this.participants);
    }
    this.close(null);
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !this.form.value.image) {
      return;
    }
    this.eventService.uploadParticipantPicture(this.form.value.image, 'Participant')
    .subscribe(uploadRes => {
      const participantToAdd = new Participant(
        null,
        form.value.firstName,
        form.value.lastName,
        form.value.email,
        form.value.phone,
        uploadRes.imageUrl,
        this.eventId
      );
      this.participants.push(participantToAdd);
      this.close(this.participants);
    });
  }

  async close(participants: Participant[]) {
    await this.modalController.dismiss(participants);
  }

}
