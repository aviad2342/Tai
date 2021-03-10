import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { Testimony } from '../../testimony/testimony.model';
import { TestimonyService } from '../../testimony/testimony.service';

@Component({
  selector: 'app-manage-testimonies',
  templateUrl: './manage-testimonies.page.html',
  styleUrls: ['./manage-testimonies.page.scss'],
})
export class ManageTestimoniesPage implements OnInit, OnDestroy {

  testimonies: Testimony[];
  selectedTestimonyId;
  private TestimonySubscription: Subscription;
   @ViewChild('testimoniesTable') testimoniesTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor(
    private testimonyService: TestimonyService,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.TestimonySubscription = this.testimonyService.testimonies.subscribe(testimonies => {
        this.testimonies = testimonies;
        this.temp = [...testimonies];
      });
    }

    ionViewWillEnter() {
      this.testimonyService.getTestimonies().subscribe(testimonies => {
        if(this.selectedTestimonyId  && this.selectedTestimonyId !== '' && this.selectedTestimonyId !== null) {
          this.selected = [];
          const testimony = testimonies.find(t => t.id === this.selectedTestimonyId);
          this.selected.push(testimony);
        }
      });
    }


    filterApprovedTestimonies(event) {
      const val = event.target.value;
      let temp;
      if (val === 'approved') {
        temp = this.temp.filter((d: Testimony)=> {
          return d.approved;
         });
      }
      if (val === 'all') {
        temp = this.temp;
      }
     this.testimonies = temp;
      }

  async onAddCoupon() {
    this.selectedTestimonyId = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'testimonies', 'new']);
  }

  async onViewCoupon() {
    this.router.navigate(['manage', 'testimonies', 'view', this.selectedTestimonyId]);
  }

  async onEditCoupon() {
    this.router.navigate(['manage', 'testimonies', 'edit', this.selectedTestimonyId]);
  }

  async onDeleteCoupon() {
      const alert = await this.alertController.create({
        cssClass: 'delete-testimonies-alert',
        header: 'אישור מחיקת העדות',
        message: `האם אתה בטוח שברצונך למחוק את העדות לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-testimonies-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.testimonyService.deleteCoupon(this.selectedTestimonyId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedTestimonyId = null;
                this.selected = [];
                this.appservice.presentToast('העדות נמחקה בהצלחה!', true);
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
    if(this.selectedTestimonyId === selected[0].code) {
      this.selected = [];
      this.selectedTestimonyId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedTestimonyId = selected[0].code;
    }
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  ngOnDestroy() {
    if (this.TestimonySubscription) {
      this.TestimonySubscription.unsubscribe();
    }
  }

}
