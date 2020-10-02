import { Component, Input, OnInit } from '@angular/core';
import { Participant } from '../../participant.model';

@Component({
  selector: 'app-participant-item',
  templateUrl: './participant-item.component.html',
  styleUrls: ['./participant-item.component.scss'],
})
export class ParticipantItemComponent implements OnInit {

  @Input() participant: Participant;

  constructor() { }

  ngOnInit() {}

  getName() {
    return  this.participant?.firstName + ' ' + this.participant?.lastName;
  }

}
