import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {

  @Input() images: string[];
  sliderOne: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 1000,
    loop: true,
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
    SlideDidChange(object, slideView) {
      this.checkIfNavDisabled(object, slideView);
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
