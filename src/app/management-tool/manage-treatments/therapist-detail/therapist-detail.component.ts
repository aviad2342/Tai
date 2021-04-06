import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Therapist } from 'src/app/therapist/therapist.model';
import { TherapistService } from 'src/app/therapist/therapist.service';

@Component({
  selector: 'app-therapist-detail',
  templateUrl: './therapist-detail.component.html',
  styleUrls: ['./therapist-detail.component.scss'],
})
export class TherapistDetailComponent implements OnInit {

  @Input() id: string;
  therapist: Therapist;

  constructor(
    private therapistService: TherapistService,
    private popoverController: PopoverController,
    ) { }

  ngOnInit() {
    this.therapistService.getTherapist(this.id).subscribe(therapist => {
      this.therapist = therapist;
    });
  }

  getTherapistFullName() {
    return this.therapist?.firstName + ' ' + this.therapist?.lastName;
  }

  getTherapistAge() {
    return new Date().getFullYear() - new Date(this.therapist?.date).getFullYear();
  }

  async close() {
    await this.popoverController.dismiss();
  }

}
