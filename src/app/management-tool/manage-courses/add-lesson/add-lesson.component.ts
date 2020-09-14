import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CourseService } from 'src/app/course/course.service';
import { AppService } from 'src/app/app.service';
import { Lesson } from 'src/app/course/lesson.model';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss'],
})
export class AddLessonComponent implements OnInit {

  @Input() id: string;
  @Input() lessonNumber: number;
  thumbnail = 'https://www.geirangerfjord.no/upload/images/2018_general/film-and-vid.jpg';

  constructor(
    private modalController: ModalController,
    private courseService: CourseService,
    private appService: AppService
    ) { }

  ngOnInit() {}

  onUrlChange(event) {
    // console.log(this.getVideoID(event.detail.value));
    if(event.detail.value && this.thumbnail !==  event.detail.value) {
      this.thumbnail = this.getVideoThumbnail(this.getVideoID(event.detail.value));
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const videoId =  this.getVideoID(form.value.videoURL);
    const lessonToAdd = new Lesson(
      null,
      this.id,
      videoId,
      form.value.videoURL,
      this.lessonNumber,
      form.value.title,
      form.value.description,
      new Date(),
      this.getVideoThumbnail(videoId)
    );
    this.courseService.addLesson(lessonToAdd).subscribe(lesson => {
      form.reset();
      this.appService.presentToast('המאמר נשמר בהצלחה', true);
      this.close(true);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
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

  async close(didAdd: boolean) {
    await this.modalController.dismiss({didAdd});
  }

  async closeBtn() {
    await this.modalController.dismiss();
  }

}
