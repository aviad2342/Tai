import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../item.model';

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss'],
})
export class StoreItemComponent implements OnInit {

  @Input() item: Item;
  // sliderOne: any;
  // slideOptsOne = {
  //   initialSlide: 0,
  //   slidesPerView: 1,
  //   autoplay: true
  // };
  constructor() { }

  ngOnInit() {
    // this.sliderOne = {
    //   isBeginningSlide: true,
    //   isEndSlide: false,
    //   slidesItems: this.item.images
    // };
  }

    // // Method called when slide is changed by drag or navigation
    // SlideDidChange(object, slideView) {
    //   this.checkIfNavDisabled(object, slideView);
    // }

    // // Call methods to check if slide is first or last to enable disbale navigation
    // checkIfNavDisabled(object, slideView) {
    //   this.checkisBeginning(object, slideView);
    //   this.checkisEnd(object, slideView);
    // }

    // checkisBeginning(object, slideView) {
    //   slideView.isBeginning().then((istrue) => {
    //     object.isBeginningSlide = istrue;
    //   });
    // }
    // checkisEnd(object, slideView) {
    //   slideView.isEnd().then((istrue) => {
    //     object.isEndSlide = istrue;
    //   });
    // }

}
