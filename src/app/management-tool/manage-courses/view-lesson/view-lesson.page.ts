import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ViewDidEnter } from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
import { CourseService } from '../../../course/course.service';
// import { YoutubePlayerWeb } from 'capacitor-youtube-player';
import { Lesson } from '../../../course/lesson.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-view-lesson',
  templateUrl: './view-lesson.page.html',
  styleUrls: ['./view-lesson.page.scss'],
})
export class ViewLessonPage implements OnInit, ViewDidEnter {

  lesson :Lesson;
  lessons :Lesson[];
  embedVideo: SafeResourceUrl;
  isLoading = false;
  hesNextClass = false;
  hesPrevious = false;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private alertController: AlertController,
    private navController: NavController,
    private courseService: CourseService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/courses');
        return;
      }
      this.courseService.getLesson(paramMap.get('id')).subscribe(lesson => {
            this.lesson = lesson;
            this.embedVideo = this.getVideoUrl(lesson.videoURL);
            this.isLoading = false;
            this.courseService.getLessonsOfCourse(paramMap.get('id')).subscribe(lessons => {
              this.lessons = lessons;
              if(this.lesson.lessonNumber < lessons.length) {
                this.hesNextClass = true;
              }
              if(this.lesson.lessonNumber > 1) {
                this.hesPrevious = true;
              }
            });
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
                      this.navController.navigateBack('/manage/courses');
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );

    });
  }

  getVideoUrl(videoUrl: string) {
    if (videoUrl.includes('youtube')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+ this.lesson.videoId);
    } else if (videoUrl.includes('vimeo')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/'+ this.lesson.videoId);
    }
    // else if (videoUrl.includes('facebook')) {
    //   return this.sanitizer
    //   .bypassSecurityTrustResourceUrl
    //   (`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.
    //   facebook.com%2Ffacebookapp%2Fvideos%2F${this.lesson.videoId}%2F`);
    // }
  }

  playClass(lesson: Lesson) {
    // this.lesson = lesson;
    // this.destroyYoutubePlayerPluginWeb();
    // this.initializeYoutubePlayerPluginWeb();
    // if(lesson.lessonNumber >= this.lessons.length) {
    //   this.hesNextClass = false;
    // } else {
    //   this.hesNextClass = true;
    // }
    // if(lesson.lessonNumber === 1) {
    //   this.hesPrevious = false;
    // } else {
    //   this.hesPrevious = true;
    // }
  }

  onNextClass() {
    this.hesPrevious = true;
    this.lesson = this.lessons[this.lesson.lessonNumber];
    this.embedVideo = this.getVideoUrl(this.lesson.videoURL);
    if(this.lesson.lessonNumber === this.lessons.length) {
      this.hesNextClass = false;
    }
  }

  onPreviousClass() {
    this.hesNextClass = true;
    this.lesson = this.lessons[this.lesson.lessonNumber - 2];
    this.embedVideo = this.getVideoUrl(this.lesson.videoURL);
    if(this.lesson.lessonNumber === 1) {
      this.hesPrevious = false;
    }
  }

  ionViewDidEnter() {
    // if (Capacitor.platform === 'web') {
    //   this.initializeYoutubePlayerPluginWeb();
    // } else { // Native
    //   // this.initializeYoutubePlayerPluginNative();
    // }
  }


  // async initializeYoutubePlayerPluginWeb() {
  //   const options = {playerId: 'youtube-player', playerSize: {width: 640, height: 360},
  //   videoId: `${this.lesson.videoId}?rel=0&showinfo=0&modestbranding=1&playsinline=1&`};
  //   const result  = await YoutubePlayerWeb.initialize(options);
  // }

  // async destroyYoutubePlayerPluginWeb() {
  //   const result = await YoutubePlayerWeb.destroy('youtube-player');
  //   // console.log('destroyYoutubePlayer', result);
  // }

  // async initializeYoutubePlayerPluginNative() {
  //   const { YoutubePlayer } = Plugins;
  //   const options = {width: 640, height: 360, videoId: `${this.lesson.videoId}?rel=0&showinfo=0&modestbranding=1&playsinline=1&`};
  //   const playerReady = await YoutubePlayer.initialize(options);
  // }

}
