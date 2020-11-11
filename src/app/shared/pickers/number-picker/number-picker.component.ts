import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss'],
})
export class NumberPickerComponent implements OnInit {

  @Input() min: number;
  @Input() max: number;
  @Output() numberPick = new EventEmitter<number>();
  numbers: number[];

  numberPickerOptions = {
    cssClass: 'number-picker-style',
  };

  constructor() { }

  ngOnInit() {
    this.numbers = Array.from(Array(this.max+1).keys());
    if(this.min && this.min > 0) {
      this.numbers.splice(this.numbers.indexOf(this.min-1), 1);
    } else {
      this.numbers.splice(0, 1);
    }
  }

  onNumberChange(event) {
    const val: number = event.target.value;
    this.numberPick.emit(val);
  }

}
