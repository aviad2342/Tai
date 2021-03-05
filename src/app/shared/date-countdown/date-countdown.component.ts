import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-countdown',
  templateUrl: './date-countdown.component.html',
  styleUrls: ['./date-countdown.component.scss'],
})
export class DateCountdownComponent implements OnInit {

  @Input() end: any;

  constructor() {
    setInterval(() => this.displayCountdown(), 1000);
   }

  ngOnInit() {}

  displayCountdown() {

    const date: any = new Date(this.end);
    const now: any = new Date();
    const distance: any = date - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const timeObj = {
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
  };

    return  timeObj;
  }

}
