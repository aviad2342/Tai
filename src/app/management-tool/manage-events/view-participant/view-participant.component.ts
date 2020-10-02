import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Participant } from '../../../event/participant.model';

@Component({
  selector: 'app-view-participant',
  templateUrl: './view-participant.component.html',
  styleUrls: ['./view-participant.component.scss'],
})
export class ViewParticipantComponent implements OnInit {

  @Input() participants: Participant[];
  temp = [];

  constructor(
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.temp = [...this.participants];
  }

  searchParticipant(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.participants = temp;
}

  close() {
  this.modalController.dismiss();
  }


}
