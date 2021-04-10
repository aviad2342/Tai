import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { HomeService } from 'src/app/home/home.service';
import { Update } from 'src/app/home/update.model';

@Component({
  selector: 'app-view-update',
  templateUrl: './view-update.page.html',
  styleUrls: ['./view-update.page.scss'],
})
export class ViewUpdatePage implements OnInit {

  update: Update;
  isLoading = false;
  activeUrl = '';


  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    public appService: AppService,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController
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
            this.isLoading = false;
          },
          error => {
            // setTimeout(() => {
            //   this.getUpdateErrorMessage('לא התקבל אישור!');
            // }, 5000);
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

  getUpdateErrorMessage(ErrorMessage: string) {
    this.alertController.create({
      header: 'ישנה תקלה!',
      message: ErrorMessage,
      buttons: [{
          text: 'אישור',
          handler: () => {
            if (this.router.isActive(this.activeUrl, false)) {
                this.navController.navigateBack('/manage/updates');
     }}}] }).then(alertEl => alertEl.present());
  }

}
