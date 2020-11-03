import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Therapist } from '../../../therapist/therapist.model';
import { AppService } from '../../../app.service';
import { TherapistService } from '../../../therapist/therapist.service';

@Component({
  selector: 'app-add-therapist',
  templateUrl: './add-therapist.component.html',
  styleUrls: ['./add-therapist.component.scss'],
})
export class AddTherapistComponent implements OnInit {

  @Input() treatmentType: string;
  therapists: Therapist[];

  constructor(
    private therapistService: TherapistService,
    private appService: AppService,
    private alertController: AlertController,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.therapistService.getTherapists().subscribe(therapists => {
      this.therapists = therapists.filter(t => t.treatmentTypes.includes(this.treatmentType));
    });
  }

  async onEmptyExit() {
    const alert = await this.alertController.create({
      cssClass: 'exit-therapist-selecte-alert',
      header: 'סיום ללא הוספת מטפל',
      message: `האם ברצונך לצאת ללא הוספת מטפל?`,
      mode: 'ios',
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'exit-therapist-selecte-alert-btn-cancel',
          handler: () => {
          }
        }, {
          text: 'יציאה',
          handler: () => {
          this.close(null);
          }
        }
      ]
    });
    await alert.present();
  }

  getTherapistFullName(therapist: Therapist) {
    return therapist.firstName + ' ' + therapist.lastName;
  }

  async close(therapist: Therapist) {
    await this.modalController.dismiss(therapist);
  }

}
