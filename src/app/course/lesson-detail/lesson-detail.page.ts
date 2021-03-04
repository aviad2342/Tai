import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { CourseService } from '../course.service';
import { Lesson } from '../lesson.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.page.html',
  styleUrls: ['./lesson-detail.page.scss'],
})
export class LessonDetailPage implements OnInit {

  lesson :Lesson;
  activeUrl = '';
  embedVideo: SafeResourceUrl;
  isLoading = false;
  isMobile = false;
  deviceWidth: number;
  deviceHeight: number;
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
    private router: Router,
    public sanitizer: DomSanitizer,
    private courseService: CourseService
    ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
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
          },
          error => {
            if (this.router.isActive(this.activeUrl, false)) {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את השיעור.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      if (this.router.isActive(this.activeUrl, false)) {
                        this.isLoading = true;
                        this.navController.navigateBack('/tabs/course');
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


}
