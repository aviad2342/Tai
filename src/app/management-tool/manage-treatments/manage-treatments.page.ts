import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from '../../../../projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { Treatment } from '../../treatment/treatment.model';
import { TreatmentService } from '../../treatment/treatment.service';
import * as utility from '../../utilities/functions';

@Component({
  selector: 'app-manage-treatments',
  templateUrl: './manage-treatments.page.html',
  styleUrls: ['./manage-treatments.page.scss'],
})
export class ManageTreatmentsPage implements OnInit, OnDestroy {

  treatments: Treatment[];
  selectedTreatmentId;
  private treatmentsSubscription: Subscription;
  @ViewChild('treatmentsTable') treatmentsTable: DatatableComponent;
	tableStyle = 'dark';
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];
  typesOfTreatments = utility.typesOfTreatments;
  treatmentTypesSelectOptions = {
    cssClass: 'select-treatment-types',
  };

  constructor(
    private therapistService: TreatmentService,
    private router: Router,
    private alertController: AlertController,
    private appService: AppService
    ) { }

    ngOnInit() {
      this.treatmentsSubscription = this.therapistService.treatments.subscribe(treatments => {
        this.treatments = treatments;
        this.temp = [...this.treatments];
      });
    }

    ionViewWillEnter() {
      this.therapistService.getTreatments().subscribe(treatments => {
        if(this.selectedTreatmentId  && this.selectedTreatmentId !== '' && this.selectedTreatmentId !== null) {
          this.selected = []
          const treatment = treatments.find(t => t.id === this.selectedTreatmentId);
          this.selected.push(treatment);
        }
      });
    }

    async onAddTreatment() {
      this.selectedTreatmentId = null;
      this.isRowSelected = false;
      this.selected = [];
      this.router.navigate(['manage', 'treatments', 'new']);
    }

    async onViewTreatment() {
      this.router.navigate(['manage', 'treatments', 'view', this.selectedTreatmentId]);
    }

    async onEditTreatment() {
      this.router.navigate(['manage', 'treatments', 'edit', this.selectedTreatmentId]);
    }

   async onDeleteTreatment() {
      const alert = await this.alertController.create({
        cssClass: 'delete-treatment-alert',
        header: 'אישור מחיקת טיפול',
        message: `האם אתה בטוח שברצונך למחוק את הטיפול לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-treatment-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.therapistService.deleteTreatment(this.selectedTreatmentId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedTreatmentId = null;
                this.selected = [];
                this.appService.presentToast('הטיפול נמחק בהצלחה!', true);
              }, error => {
                this.appService.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
              });
            }
          }
        ]
      });
      await alert.present();
  }

  onSelect({ selected }) {
    if(this.selectedTreatmentId === selected[0].id) {
      this.selected = [];
      this.selectedTreatmentId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedTreatmentId = selected[0].id;
    }
  }

  filterByTreatmentType(event) {
    this.selectedTreatmentId = null;
    this.isRowSelected = false;
    this.selected = [];
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.treatmentType.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.treatments = temp;
}

  filterByTherapistName(event) {
    this.selectedTreatmentId = null;
    this.isRowSelected = false;
    this.selected = [];
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.therapistName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.treatments = temp;
}

  getUserFullName() {
      return this.selected[0]?.firstName + ' ' + this.selected[0]?.lastName;
    }

  ngOnDestroy() {
      if (this.treatmentsSubscription) {
        this.treatmentsSubscription.unsubscribe();
      }
    }


}
