import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CourseService } from '../course.service';
import { Lesson } from '../lesson.model';
import { Capacitor, Plugins } from '@capacitor/core';
// import { YoutubePlayerWeb } from 'capacitor-youtube-player';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.page.html',
  styleUrls: ['./lesson-detail.page.scss'],
})
export class LessonDetailPage implements OnInit {

  lesson :Lesson;
  embedVideo: SafeResourceUrl;
  isLoading = false;
  isMobile = false;
  deviceWidth: number;
  deviceHeight: number;
  options: StreamingVideoOptions = {
    successCallback: () => { console.log('Video played') },
    errorCallback: (e) => { console.log('Error streaming') },
    orientation: 'landscape',
    shouldAutoClose: true,
    controls: false
  };
  @HostListener('window:resize', ['$event'])
     onResize(event) {
      this.deviceWidth = (this.platform.width() > 650 )? 650 : this.platform.width();
      this.deviceHeight = (this.platform.width() > 650 )? 650 - (650 * 0.45 ) :this.platform.width() - (this.platform.width() * 0.45 );
}

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private navController: NavController,
    private platform: Platform,
    public sanitizer: DomSanitizer,
    private youtube: YoutubeVideoPlayer,
    private streamingMedia: StreamingMedia,
    private courseService: CourseService
    ) { }

  ngOnInit() {
    this.isMobile = this.platform.is('mobile');
    this.isLoading = true;
    this.deviceWidth = (this.platform.width() > 650 )? 650 : this.platform.width();
    this.deviceHeight = (this.platform.width() > 650 )? 650 - (650 * 0.45 ) :this.platform.width() - (this.platform.width() * 0.45 );
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/tabs/course');
        return;
      }
      this.courseService.getLesson(paramMap.get('id')).subscribe(lesson => {
            this.lesson = lesson;
            this.embedVideo = this.getVideoUrl(lesson.videoURL);
            this.isLoading = false;
            if (Capacitor.platform === 'web') {
              // this.initializeYoutubePlayerPluginWeb();
            } else { // Native
              // this.initializeYoutubePlayerPluginNative();
            }
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


  onPlayVideo() {
    this.streamingMedia.playVideo('http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', this.options);
    // this.youtube.openVideo(this.lesson.videoId);
  }

  getVideoUrl(videoUrl: string) {
    if (videoUrl.includes('youtube')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+ this.lesson.videoId);
    } else if (videoUrl.includes('vimeo')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/'+ this.lesson.videoId);
    }
  }

  getVideoThumbnail(){
    return `https://img.youtube.com/vi/${this.lesson.videoId}/sddefault.jpg`;
  }

  // async initializeYoutubePlayerPluginWeb() {
  //   const options = {playerId: 'video-player', playerSize: {width: this.deviceWidth, height: 300},
  //   videoId: `${this.lesson.videoId}?rel=0&showinfo=0&modestbranding=1&playsinline=1&`};
  //   const result  = await YoutubePlayerWeb.initialize(options);
  // }

  // async destroyYoutubePlayerPluginWeb() {
  //   const result = await YoutubePlayerWeb.destroy('youtube-player');
  //   console.log('destroyYoutubePlayer', result);
  // }

  // async initializeYoutubePlayerPluginNative() {
  //   const { YoutubePlayer } = Plugins;
  //   const options = {width: 640, height: 360, videoId: `${this.lesson.videoId}?rel=0&showinfo=0&modestbranding=1&playsinline=1&`};
  //   const playerReady = await YoutubePlayer.initialize(options);
  // }


}
