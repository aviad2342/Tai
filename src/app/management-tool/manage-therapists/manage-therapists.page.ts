import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from '../../../../projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { Therapist } from '../../therapist/therapist.model';
import { TherapistService } from '../../therapist/therapist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-therapists',
  templateUrl: './manage-therapists.page.html',
  styleUrls: ['./manage-therapists.page.scss'],
})
export class ManageTherapistsPage implements OnInit, OnDestroy {

  therapists: Therapist[];
  selectedTherapistId;
  private therapistsSubscription: Subscription;
  @ViewChild('therapistsTable') therapistsTable: DatatableComponent;
	tableStyle = 'dark';
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];

  constructor(
    private therapistService: TherapistService,
    private router: Router,
    private alertController: AlertController,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.therapistsSubscription = this.therapistService.therapists.subscribe(therapists => {
        this.therapists = therapists;
        this.temp = [...this.therapists];
      });
    }

    ionViewWillEnter() {
      this.therapistService.getTherapists().subscribe(therapists => {
        if(this.selectedTherapistId  && this.selectedTherapistId !== '' && this.selectedTherapistId !== null) {
          this.selected = []
          const therapist = therapists.find(t => t.id === this.selectedTherapistId);
          this.selected.push(therapist);
        }
      });
    }

    async onAddTherapist() {
      this.selectedTherapistId = null;
      this.isRowSelected = false;
      this.selected = [];
      this.router.navigate(['manage', 'therapists', 'new']);
    }

    async onViewTherapist() {
      this.router.navigate(['manage', 'therapists', 'view', this.selectedTherapistId]);
    }

    async onEditTherapist() {
      this.router.navigate(['manage', 'therapists', 'edit', this.selectedTherapistId]);
    }

   async onDeleteTherapist() {
      const alert = await this.alertController.create({
        cssClass: 'delete-article-alert',
        header: 'אישור מחיקת מטפל',
        message: `האם אתה בטוח שברצונך למחוק את המטפל לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-article-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.therapistService.deleteTherapist(this.selectedTherapistId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedTherapistId = null;
                this.selected = [];
                this.appservice.presentToast('המטפל נמחק בהצלחה!', true);
              }, error => {
                this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
              });
            }
          }
        ]
      });
      await alert.present();
  }

  onSelect({ selected }) {
    if(this.selectedTherapistId === selected[0].id) {
      this.selected = [];
      this.selectedTherapistId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedTherapistId = selected[0].id;
    }
  }

  filterByFirstName(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.therapists = temp;
}

  filterByLastName(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.lastName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.therapists = temp;
}

  filterByMail(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.email.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.therapists = temp;
}

  filterByCity(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.city.toLowerCase().indexOf(val) !== -1 || !val;
  });
    this.therapists = temp;
  }

  getUserFullName() {
      return this.selected[0]?.firstName + ' ' + this.selected[0]?.lastName;
    }

  ngOnDestroy() {
      if (this.therapistsSubscription) {
        this.therapistsSubscription.unsubscribe();
      }
    }

}
