import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Speaker } from '../../../event/speaker.model';

@Component({
  selector: 'app-view-speaker',
  templateUrl: './view-speaker.component.html',
  styleUrls: ['./view-speaker.component.scss'],
})
export class ViewSpeakerComponent implements OnInit {

  @Input() speaker: Speaker;

  constructor(
    private modalController: ModalController
    ) { }

  ngOnInit() {}

  getName() {
    return this.speaker?.title + ' ' + this.speaker?.firstName + ' ' + this.speaker?.lastName;
  }

  close() {
    this.modalController.dismiss();
    }

}
