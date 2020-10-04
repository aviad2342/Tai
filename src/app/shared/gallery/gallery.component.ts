import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {

  @Input() images: string[];
  @ViewChild(IonSlides) GallerySlides: IonSlides;
  @Output() slideActiveIndex = new EventEmitter<number>();
  sliderOne: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    preloadImages: true,
    updateOnImagesReady: true,
    spaceBetween: 1,
    speed: 1000,
    // loop: true,
    autoplay: true
  };

  constructor() { }

  ngOnInit() {
    this.sliderOne = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: this.images
    };
  }


      // Method called when slide is changed by drag or navigation
    SlideDidChange(slideView: IonSlides) {
      slideView.getActiveIndex().then(index => {
        this.slideActiveIndex.emit(index);
      });
    }

    // Call methods to check if slide is first or last to enable disbale navigation
    checkIfNavDisabled(object, slideView) {
      this.checkisBeginning(object, slideView);
      this.checkisEnd(object, slideView);
    }

    checkisBeginning(object, slideView) {
      slideView.isBeginning().then((istrue) => {
        object.isBeginningSlide = istrue;
      });
    }
    checkisEnd(object, slideView) {
      slideView.isEnd().then((istrue) => {
        object.isEndSlide = istrue;
      });
    }
}
