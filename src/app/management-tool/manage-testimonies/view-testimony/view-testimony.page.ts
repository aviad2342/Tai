import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonCheckbox, NavController } from '@ionic/angular';
import { AppService } from '../../../app.service';
import { Testimony } from '../../../testimony/testimony.model';
import { TestimonyService } from '../../../testimony/testimony.service';

@Component({
  selector: 'app-view-testimony',
  templateUrl: './view-testimony.page.html',
  styleUrls: ['./view-testimony.page.scss'],
})
export class ViewTestimonyPage implements OnInit {

  testimony: Testimony;
  isLoading = false;
  activeUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public appService: AppService,
    private alertController: AlertController,
    private navController: NavController,
    private testimonyService: TestimonyService,
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/testimonies');
        return;
      }
      this.testimonyService.getTestimony(paramMap.get('id')).subscribe(testimony => {
            this.testimony = testimony;
            this.isLoading = false;
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את העדות.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.navController.navigateBack('/manage/testimonies');
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

  onTestimonyApproved() {
    this.testimonyService.updateTestimony(this.testimony).subscribe(() => {
      if(this.testimony.approved) {
        this.appService.presentToast('העדות אושרה בהצלחה', true);
      } else {
        this.appService.presentToast('אישור העדות הוסר בהצלחה', true);
      }
    }, error => {
      this.appService.presentToast('חלה תקלה פרטי העדות לא נשמרו', false);
    });

  }

}
