import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, Platform, ViewDidEnter } from '@ionic/angular';
import { CourseService } from '../course.service';
import { Lesson } from '../lesson.model';
import { Capacitor, Plugins } from '@capacitor/core';
import { YoutubePlayerWeb } from 'capacitor-youtube-player';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.page.html',
  styleUrls: ['./lesson-detail.page.scss'],
})
export class LessonDetailPage implements OnInit, ViewDidEnter {

  lesson :Lesson;
  isLoading = false;
  deviceWidth: number;
  deviceHeight: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private platform: Platform,
    // private youtube: YoutubeVideoPlayer,
    private courseService: CourseService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.deviceWidth = (this.platform.width() > 650 )? 650 : this.platform.width() - 10;
    this.deviceHeight = (this.platform.height() > 300 )? 360 : 300;
    // this.platform.resize.subscribe(async () => {
    //   this.deviceWidth = this.platform.width() - 10;
    // });
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/course');
        return;
      }
      this.courseService.getLesson(paramMap.get('id')).subscribe(lesson => {
            this.lesson = lesson;
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את השיעור.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/tabs/course']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );

    });
  }

  onPlayVideo() {
   // this.youtube.openVideo('0VDgZ2OnfAw');
  }

  ionViewDidEnter() {
    if (Capacitor.platform === 'web') {
      this.initializeYoutubePlayerPluginWeb();
    } else { // Native
      this.initializeYoutubePlayerPluginNative();
    }
  }


  async initializeYoutubePlayerPluginWeb() {
    const options = {playerId: 'video-player', playerSize: {width: this.deviceWidth, height: 300},
    videoId: `${this.lesson.videoId}?rel=0&showinfo=0&modestbranding=1&playsinline=1&`};
    const result  = await YoutubePlayerWeb.initialize(options);
  }

  async destroyYoutubePlayerPluginWeb() {
    const result = await YoutubePlayerWeb.destroy('youtube-player');
    console.log('destroyYoutubePlayer', result);
  }

  async initializeYoutubePlayerPluginNative() {
    const { YoutubePlayer } = Plugins;
    const options = {width: 640, height: 360, videoId: `${this.lesson.videoId}?rel=0&showinfo=0&modestbranding=1&playsinline=1&`};
    const playerReady = await YoutubePlayer.initialize(options);
  }


}
