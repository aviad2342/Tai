import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';
import { Speaker } from '../../../event/speaker.model';
import { Event } from '../../../event/event.model';
import { EventService } from '../../../event/event.service';
import { ViewParticipantComponent } from '../view-participant/view-participant.component';
import { ViewSpeakerComponent } from '../view-speaker/view-speaker.component';
import { GalleryImage } from './galleryImage.model';


@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit {

  event: Event;
  isLoading = false;
  galleryImages: GALLERY_IMAGE[] = [];
  @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;
  slideActiveIndex = 0;
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private modalController: ModalController,
    private eventService: EventService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/courses');
        return;
      }
      this.eventService.getEvent(paramMap.get('id')).subscribe(event => {
            this.event = event;
            this.isLoading = false;
            if(this.event.images) {
              this.galleryImages.push(...this.setGalleryImages(this.event.images))
            }
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המאמר.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.navController.navigateBack('/manage/courses');
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  onActiveIndexChange(activeIndex: number) {
    this.slideActiveIndex = activeIndex;
  }

  async onViewParticipants() {
    const modal = await this.modalController.create({
      component: ViewParticipantComponent,
      cssClass: 'view-participant-modal',
      backdropDismiss: false,
      animated: true,
      componentProps: {
        participants: this.event.participants
      }
    });
    return await modal.present();
  }

  async onViewspeaker(speaker: Speaker) {
    const modal = await this.modalController.create({
      component: ViewSpeakerComponent,
      cssClass: 'view-speaker-modal',
      backdropDismiss: false,
      animated: true,
      componentProps: {
        speaker
      }
    });
    return await modal.present();
  }

  getAddress() {
    return this.event?.street + ' ' + this.event?.houseNumber + ', ' + this.event?.city + ', ' + this.event?.country;
  }

  setGalleryImages(images: string[]) {
    const galleryImages: GalleryImage[] = [];
    images.forEach(image => {
      galleryImages.push(new GalleryImage(image, image));
    });
    return galleryImages;
  }

  openGallery(index: number = 0) {
    this.ngxImageGallery.open(index);
  }

  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }

  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }

  /**************************************************/

  // EVENTS
  // callback on gallery opened
  galleryOpened(index) {
    console.log('Gallery opened at index ', index);
  }

  // callback on gallery closed
  galleryClosed() {
    console.log('Gallery closed.');
  }

  // callback on gallery image clicked
  galleryImageClicked(index) {
    console.log('Gallery image clicked with index ', index);
  }

  // callback on gallery image changed
  galleryImageChanged(index) {
    console.log('Gallery image changed to index ', index);
  }

  // callback on user clicked delete button
  deleteImage(index) {
    console.log('Delete image at index ', index);
  }

}
