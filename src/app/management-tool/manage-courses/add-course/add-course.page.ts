import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.page.html',
  styleUrls: ['./add-course.page.scss'],
})
export class AddCoursePage implements OnInit {

  @ViewChild('stepper') newCourseStepper: IonSlides;

  slideOpts = {
    allowSlidePrev: false,
    allowTouchMove: false
  };

  constructor() { }

  ngOnInit() {
  }

  onSlideNext() {
    this.newCourseStepper.slideNext();
  }

}
