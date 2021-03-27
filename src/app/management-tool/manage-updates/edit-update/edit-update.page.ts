import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AppService } from '../../../app.service';
import { HomeService } from '../../../home/home.service';
import * as utility from '../../../utilities/functions';
import { ProductData, Update } from '../../../home/update.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-update',
  templateUrl: './edit-update.page.html',
  styleUrls: ['./edit-update.page.scss'],
})
export class EditUpdatePage implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  update: Update;
  now = new Date().toISOString();
  isLoading = false;
  activeUrl = '';


  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    public appService: AppService,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/updates');
        return;
      }
      this.homeService.getUpdate(paramMap.get('id')).subscribe(update => {
            this.update = update;
            const updateObj = {
              updateType:  update.updateType,
              description: update.description,
              endUpdate:   update.endUpdate,
              active:      update.active
              };
            this.form.setValue(updateObj);
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את העדכון.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/manage/updates');
                      }
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
            }
          }
        );
    });
  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const updateToAEdit = new Update(
          this.update.id,
          this.update.updateType,
          form.value.description,
          this.update.date,
          form.value.endUpdate,
          this.update.url,
          form.value.active,
          this.update.productId
        );
      this.homeService.updateUpdate(updateToAEdit).subscribe(() => {
      this.appService.presentToast('העדכון נערך בהצלחה', true);
      this.navController.navigateBack('/manage/updates');
      form.reset();
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי העדכון לא נשמרו', false);
    }
    );
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.navController.navigateBack('/manage/updates');
  }
}
