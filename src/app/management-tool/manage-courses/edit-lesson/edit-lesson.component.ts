import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { CourseService } from 'src/app/course/course.service';
import { Lesson } from 'src/app/course/lesson.model';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss'],
})
export class EditLessonComponent implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  @Input() lesson: Lesson;

  constructor(
    private modalController: ModalController,
    private courseService: CourseService,
    private appService: AppService
    ) { }

  ngOnInit() {
    const lessonObj = {
      title: this.lesson?.title,
      description: this.lesson?.description,
      videoURL: this.lesson?.videoURL
      };
      setTimeout(() => {
        this.form.setValue(lessonObj);
      });
  }

  onUrlChange(event) {
    // console.log(this.getVideoID(event.detail.value));
    if(event.detail.value && this.lesson?.thumbnail !==  event.detail.value) {
      this.lesson.thumbnail = this.getVideoThumbnail(this.getVideoID(event.detail.value));
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const videoId =  this.getVideoID(form.value.videoURL);
    const lessonToUpdate = new Lesson(
      this.lesson.id,
      this.lesson.courseId,
      videoId,
      form.value.videoURL,
      this.lesson.lessonNumber,
      form.value.title,
      form.value.description,
      this.lesson.date,
      this.getVideoThumbnail(videoId)
    );
    this.courseService.updateLesson(lessonToUpdate).subscribe(lesson => {
      form.reset();
      this.appService.presentToast('השיעור עודכן בהצלחה', true);
      this.close(true);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי השיעור לא נשמרו!', false);
      this.close(false);
    });
  }

  getVideoID(videoURL: string){
    if(videoURL.includes('v=')) {
      return videoURL.split('v=')[1].split('&')[0];
    } else if(videoURL.includes('/embed/')) {
      return videoURL.split('/embed/')[videoURL.split('/embed/').length - 1];
    } else if(videoURL.includes('vimeo')) {
      this.courseService.getVimeoVideoId(videoURL).subscribe(videoId => {
        return videoId;
      });
    }
  }

  getVideoThumbnail(videoId: string){
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }

  // getVideoThumbnail1(videoURL: string){
  //   if(videoURL.includes('youtube')) {
  //     this.courseService.getYouTubeVideoThumbnail(videoURL).subscribe(videoThumbnail=> {
  //       return videoThumbnail;
  //     });
  //   } else if(videoURL.includes('vimeo')) {
  //     this.courseService.getVimeoVideoThumbnail(videoURL).subscribe(videoThumbnail=> {
  //       return videoThumbnail;
  //     });
  //   } else {
  //     return 'https://www.geirangerfjord.no/upload/images/2018_general/film-and-vid.jpg';
  //   }
  // }

  async close(didAdd: boolean) {
    await this.modalController.dismiss({didAdd});
  }

  async closeBtn() {
    await this.modalController.dismiss();
  }
}
