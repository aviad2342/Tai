import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { HomeService } from '../../home/home.service';
import { Update } from '../../home/update.model';

@Component({
  selector: 'app-manage-updates',
  templateUrl: './manage-updates.page.html',
  styleUrls: ['./manage-updates.page.scss'],
})
export class ManageUpdatesPage implements OnInit, OnDestroy {

  updates: Update[];
  selectedUpdateId;
  private updatesSubscription: Subscription;
   @ViewChild('updatesTable') updatesTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor(
    private homeService: HomeService,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.updatesSubscription = this.homeService.updates.subscribe(updates => {
        this.updates = updates;
        this.temp = [...updates];
      });
    }

    ionViewWillEnter() {
      this.homeService.getUpdates().subscribe(updates => {
        if(this.selectedUpdateId  && this.selectedUpdateId !== '' && this.selectedUpdateId !== null) {
          this.selected = [];
          const update = updates.find(u => u.id === this.selectedUpdateId);
          this.selected.push(update);
        }
      });
    }


    filterActiveUpdates(event) {
      const val = event.target.value;
      let temp;
      if (val === 'active') {
        temp = this.temp.filter((u: Update)=> {
          return u.active;
         });
      }
      if (val === 'all') {
        temp = this.temp;
      }
     this.updates = temp;
      }

  async onAddUpdate() {
    this.selectedUpdateId = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'updates', 'new']);
  }

  async onViewUpdate() {
    this.router.navigate(['manage', 'updates', 'view', this.selectedUpdateId]);
  }

  async onEditUpdate() {
    this.router.navigate(['manage', 'updates', 'edit', this.selectedUpdateId]);
  }

  async onDeleteUpdate() {
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
              this.homeService.deleteUpdate(this.selectedUpdateId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedUpdateId = null;
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
    if(this.selectedUpdateId === selected[0].id) {
      this.selected = [];
      this.selectedUpdateId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedUpdateId = selected[0].id;
    }
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  ngOnDestroy() {
    if (this.updatesSubscription) {
      this.updatesSubscription.unsubscribe();
    }
  }
}
