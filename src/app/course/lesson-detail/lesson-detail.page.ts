import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, Platform, ViewDidEnter } from '@ionic/angular';
import { CourseService } from '../course.service';
import { Lesson } from '../lesson.model';
import { Capacitor, Plugins } from '@capacitor/core';
import { YoutubePlayerWeb } from 'capacitor-youtube-player';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import * as PluginsLibrary from 'capacitor-video-player';
const { CapacitorVideoPlayer,Device } = Plugins;

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.page.html',
  styleUrls: ['./lesson-detail.page.scss'],
})
export class LessonDetailPage implements OnInit, AfterViewInit {

  lesson :Lesson;
  isLoading = false;
  isMobile = false;
  deviceWidth: number;
  deviceHeight: number;
  videoPlayer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private platform: Platform,
    private youtube: YoutubeVideoPlayer,
    private courseService: CourseService
    ) { }

  ngOnInit() {
    this.isMobile = this.platform.is('mobile');
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
            // if (Capacitor.platform === 'web') {
            //   this.initializeYoutubePlayerPluginWeb();
            // } else { // Native
            //   // this.initializeYoutubePlayerPluginNative();
            // }
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
                      this.isLoading = true;
                      this.navController.navigateBack('/tabs/course');
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );

    });
  }

  async ngAfterViewInit() {
    const info = await Device.getInfo();
    if (info.platform === 'ios' || info.platform === 'android') {
      this.videoPlayer = CapacitorVideoPlayer;
      console.log('mob');
    } else {
      console.log('web');
      this.videoPlayer = PluginsLibrary.CapacitorVideoPlayer
    }
  }

  async play() {
    const res: any = await this.videoPlayer.initPlayer({ mode: 'fullscreen', url: 'https://www.youtube.com/watch?v=7T7EItoCd2E&ab_channel=ZwagandHeiz' });
    // document.addEventListener('jeepCapVideoPlayerPlay', (e: CustomEvent) => {
    //    console.log('Event jeepCapVideoPlayerPlay ', e.detail) }, false);
    // document.addEventListener('jeepCapVideoPlayerPause', (e: CustomEvent) => {
    //    console.log('Event jeepCapVideoPlayerPause ', e.detail) }, false);
    // document.addEventListener('jeepCapVideoPlayerEnded', (e: CustomEvent) => {
    //    console.log('Event jeepCapVideoPlayerEnded ', e.detail) }, false);
  }

  onPlayVideo() {
   this.youtube.openVideo(this.lesson.videoId);
  }

  getVideoThumbnail(){
    return `https://img.youtube.com/vi/${this.lesson.videoId}/sddefault.jpg`;
  }

  // ngAfterViewInit() {
  //   this.lessonSubscription = this.courseService.lesson.subscribe(lesson => {
  //     this.lesson = lesson;
  //     if (Capacitor.platform === 'web') {
  //       this.initializeYoutubePlayerPluginWeb();
  //     } else { // Native
  //       this.initializeYoutubePlayerPluginNative();
  //     }
  //   });
  // }


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
