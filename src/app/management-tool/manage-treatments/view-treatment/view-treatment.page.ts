import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { TreatmentService } from '../../../treatment/treatment.service';
import { Treatment } from '../../../treatment/treatment.model';
import { TherapistDetailComponent } from '../therapist-detail/therapist-detail.component';

@Component({
  selector: 'app-view-treatment',
  templateUrl: './view-treatment.page.html',
  styleUrls: ['./view-treatment.page.scss'],
})
export class ViewTreatmentPage implements OnInit {

  treatment: Treatment;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private popoverController: PopoverController,
    private treatmentService: TreatmentService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/treatments');
        return;
      }
      this.treatmentService.getTreatment(paramMap.get('id')).subscribe(treatment => {
            this.treatment = treatment;
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את הטיפול.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/manage/treatments']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  async onTherapistDetail(ev: any) {
    const popover = await this.popoverController.create({
      component: TherapistDetailComponent,
      cssClass: 'therapist-detail-popover',
      animated: true,
      mode: 'ios',
      event: ev,
      backdropDismiss: false,
      componentProps: {
        id: this.treatment.therapistId
      }
    });
    return await popover.present();
  }

}
