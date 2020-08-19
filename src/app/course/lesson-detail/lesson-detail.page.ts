import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ViewDidEnter } from '@ionic/angular';
import { CourseService } from '../course.service';
import { UserService } from 'src/app/user/user.service';
import { Lesson } from '../lesson.model';
import { User } from 'src/app/user/user.model';
import { Capacitor, Plugins } from '@capacitor/core';
import { YoutubePlayerWeb } from 'capacitor-youtube-player';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.page.html',
  styleUrls: ['./lesson-detail.page.scss'],
})
export class LessonDetailPage implements OnInit, ViewDidEnter {

  lesson :Lesson;
  author: User;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private courseService: CourseService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.isLoading = true;
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
                message: 'לא ניתן להציג את המאמר.',
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
