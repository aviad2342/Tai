import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ColumnMode, DatatableComponent, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { Video } from '../../video/video.model';
import { VideoService } from '../../video/video.service';

@Component({
  selector: 'app-manage-videos',
  templateUrl: './manage-videos.page.html',
  styleUrls: ['./manage-videos.page.scss'],
})
export class ManageVideosPage implements OnInit, OnDestroy {

  videos: Video[];
  selectedVideoId;
  private videosSubscription: Subscription;
   @ViewChild('videosTable') videosTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor(
    private videoService: VideoService,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.videosSubscription = this.videoService.videos.subscribe(videos => {
        this.videos = videos;
        this.temp = [...videos];
      });
    }

    ionViewWillEnter() {
      this.videoService.getVideos().subscribe(videos => {
        if(this.selectedVideoId  && this.selectedVideoId !== '' && this.selectedVideoId !== null) {
          this.selected = [];
          const update = videos.find(v => v.id === this.selectedVideoId);
          this.selected.push(update);
        }
      });
    }


    filterVideos(event) {
      this.selectedVideoId = null;
      this.isRowSelected = false;
      this.selected = [];
      const val = event.target.value;
      let temp;
      temp = this.temp.filter((u: Video)=> {
        return u.title;
       });
     this.videos = temp;
      }

  async onAddVideo() {
    this.selectedVideoId = null;
    this.isRowSelected = false;
    this.selected = [];
    this.router.navigate(['manage', 'videos', 'new']);
  }

  async onViewVideo() {
    this.router.navigate(['manage', 'videos', 'view', this.selectedVideoId]);
  }

  async onEditVideo() {
    this.router.navigate(['manage', 'videos', 'edit', this.selectedVideoId]);
  }

  async onDeleteVideo() {
      const alert = await this.alertController.create({
        cssClass: 'delete-video-alert',
        header: 'אישור מחיקת סירטון',
        message: `האם אתה בטוח שברצונך למחוק את הסירטון לצמיתות?`,
        mode: 'ios',
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-video-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              this.videoService.deleteVideo(this.selectedVideoId).subscribe( () => {
                this.isRowSelected = false;
                this.selectedVideoId = null;
                this.selected = [];
                this.appservice.presentToast('הסירטון נמחקה בהצלחה!', true);
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
    if(this.selectedVideoId === selected[0].id) {
      this.selected = [];
      this.selectedVideoId = '';
      this.isRowSelected = false;
    } else {
      this.isRowSelected = true;
      this.selectedVideoId = selected[0].id;
    }
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  ngOnDestroy() {
    if (this.videosSubscription) {
      this.videosSubscription.unsubscribe();
    }
  }

}
