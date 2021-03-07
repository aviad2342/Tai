import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-countdown',
  templateUrl: './date-countdown.component.html',
  styleUrls: ['./date-countdown.component.scss'],
})
export class DateCountdownComponent implements OnInit, AfterViewChecked {

  @Input() end: any;
  now: any = new Date();
  alertTimer = '';

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
    setInterval(() => this.displayCountdown(), 1000);
   }

  ngOnInit() {
    const d: any = new Date(this.end);
    const n: any = new Date(this.now);
    const t: any = d - n;
    const days = Math.floor(t / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      this.alertTimer = 'time-over';
    } else if (days <= 1) {
      this.alertTimer = 'time-blink-2';
    } else if (days <= 2) {
      this.alertTimer = 'time-blink-1';
    } else if (days <= 3) {
      this.alertTimer = 'time-alret';
    } else {
      this.alertTimer = '';
    }
  }

  ngAfterViewChecked()
{
  this.now = new Date();
  this.cdRef.detectChanges();
}

  displayCountdown() {

    const date: any = new Date(this.end);
    const now: any = new Date(this.now);
    const distance: any = date - now;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
       days = 0;
       hours = 0;
       minutes = 0;
       seconds = 0;
    }

    const timeObj = {
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
  };

    return  timeObj;
  }

}
