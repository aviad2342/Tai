import { Component, OnInit, Input } from '@angular/core';
import { Speaker } from '../../speaker.model';


@Component({
  selector: 'app-speaker-item',
  templateUrl: './speaker-item.component.html',
  styleUrls: ['./speaker-item.component.scss'],
})
export class SpeakerItemComponent implements OnInit {

  @Input() speaker: Speaker;

  constructor() { }

  ngOnInit() { }

  getName() {
    return this.speaker?.title + ' ' + this.speaker?.firstName + ' ' + this.speaker?.lastName;
  }

}
