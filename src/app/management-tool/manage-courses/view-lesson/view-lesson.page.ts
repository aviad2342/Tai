import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ViewDidEnter } from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
import { CourseService } from 'src/app/course/course.service';
import { YoutubePlayerWeb } from 'capacitor-youtube-player';
import { Lesson } from 'src/app/course/lesson.model';


@Component({
  selector: 'app-view-lesson',
  templateUrl: './view-lesson.page.html',
  styleUrls: ['./view-lesson.page.scss'],
})
export class ViewLessonPage implements OnInit, ViewDidEnter {

  lesson :Lesson;
  lessons :Lesson[];
  isLoading = false;
  hesNextClass = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
            this.isLoading = false;
            this.courseService.getCourseLessons(lesson.courseId).subscribe(lessons => {
              this.lessons = lessons;
              if(this.lesson.lessonNumber < lessons.length) {
                this.hesNextClass = true;
              }
            });
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המאמר.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.router.navigate(['/manage/courses']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );

    });
  }

  playNextClass(lesson: Lesson) {
    this.lesson = lesson;
    this.destroyYoutubePlayerPluginWeb();
    this.initializeYoutubePlayerPluginWeb();
    if(lesson.lessonNumber >= this.lessons.length) {
      this.hesNextClass = false;
    } else {
      this.hesNextClass = true;
    }
  }

  onNextClass() {
    this.lesson = this.lessons[this.lesson.lessonNumber];
    if(this.lesson.lessonNumber === this.lessons.length) {
      this.hesNextClass = false;
    }
    this.destroyYoutubePlayerPluginWeb();
    this.initializeYoutubePlayerPluginWeb();
  }

  ionViewDidEnter() {
    if (Capacitor.platform === 'web') {
      this.initializeYoutubePlayerPluginWeb();
    } else { // Native
      this.initializeYoutubePlayerPluginNative();
    }
  }


  async initializeYoutubePlayerPluginWeb() {
    const options = {playerId: 'youtube-player', playerSize: {width: 640, height: 360},
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
