import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Therapist } from '../../../therapist/therapist.model';
import { TherapistService } from '../../../therapist/therapist.service';

@Component({
  selector: 'app-view-therapist',
  templateUrl: './view-therapist.page.html',
  styleUrls: ['./view-therapist.page.scss'],
})
export class ViewTherapistPage implements OnInit {

  therapist: Therapist;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private therapistService: TherapistService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/therapists');
        return;
      }
      this.therapistService.getTherapist(paramMap.get('id')).subscribe(therapist => {
            this.therapist = therapist;
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את פרטי המטפל.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/manage/therapists']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

  getTherapistFullName() {
    return this.therapist?.firstName + ' ' + this.therapist?.lastName;
  }

  getTherapistAge() {
    return new Date().getFullYear() - new Date(this.therapist?.date).getFullYear();
  }

  getTherapistAddress() {
    return this.therapist?.street + ' ' + this.therapist?.houseNumber + ', ' + this.therapist?.city + ', ' + this.therapist?.country;
  }

}
