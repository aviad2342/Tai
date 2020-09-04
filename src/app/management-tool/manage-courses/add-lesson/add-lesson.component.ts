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

  constructor(
    private modalController: ModalController,
    private courseService: CourseService,
    private appService: AppService
    ) { }

  ngOnInit() {}

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
    const videoId = videoURL.split('v=')[1].split('&')[0];
    console.log(videoId);
    return videoId;
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
