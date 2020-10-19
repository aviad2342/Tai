import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../course/course.service';
import { NavController, ModalController, IonReorderGroup, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Course } from '../../../course/course.model';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../../../app.service';
import { Lesson } from '../../../course/lesson.model';
import { AddLessonComponent } from '../add-lesson/add-lesson.component';
import { EditLessonComponent } from '../edit-lesson/edit-lesson.component';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.page.html',
  styleUrls: ['./edit-course.page.scss'],
})
export class EditCoursePage implements OnInit {

  course: Course;
  lessons: Lesson[];
  @ViewChild('f', { static: true }) form: NgForm;
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  updateImage;
  isLoading = false;
  defaultThumbnail = 'http://localhost:3000/images/filmDefaultImage.jpg';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private navCtrl: NavController,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    public appService: AppService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/manage/courses');
        return;
      }
      this.isLoading = true;
      this.courseService.getCourse(paramMap.get('id')).
      subscribe(course => {
        this.course = course;
        this.isLoading = false;
        const courseObj = {
          title: this.course.title,
          description: this.course.description
          };
        this.form.setValue(courseObj);
      });
    });
  }

  // -------------------------------------------------- Course Functions ----------------------------------------------------

  onSubmit(form: NgForm) {
    // form.value.image = this.file;
    if (!form.valid) {
      return;
    }
    if (this.updateImage) {
    this.courseService.uploadCourseThumbnail(this.updateImage, 'course')
    .pipe(
      switchMap(uploadRes => {
        const courseToUpdate = new Course(
          this.course.id,
          this.course.authorId,
          this.course.authorName,
          this.course.catalogNumber,
          form.value.title,
          form.value.description,
          this.course.date,
          new Date(),
          uploadRes.imageUrl,
          this.course.lessons.length,
          this.lessons
        );
        return this.courseService.updateCourse(courseToUpdate);
      })
    ).subscribe(newCourse => {
      this.appService.presentToast('הקורס עודכן בהצלחה', true);
      this.router.navigate(['/manage/courses']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה עדכון הקורס נכשל!', false);
      this.router.navigate(['/manage/courses']);
    }
    );
  } else {
    const courseToUpdate = new Course(
      this.course.id,
      this.course.authorId,
      this.course.authorName,
      this.course.catalogNumber,
      form.value.title,
      form.value.description,
      this.course.date,
      new Date(),
      this.course.thumbnail,
      this.course.lessons.length,
      this.lessons
    );
    if( this.isEquals(this.course, courseToUpdate)) {
      this.appService.presentToast('הקורס עודכן בהצלחה', true);
      this.router.navigate(['/manage/courses']);
      return;
    }
    this.courseService.updateCourse(courseToUpdate).subscribe(newCourse => {
      this.appService.presentToast('הקורס עודכן בהצלחה', true);
      this.router.navigate(['/manage/courses']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה עדכון הקורס נכשל!', false);
      this.router.navigate(['/manage/courses']);
    }
    );
  }
  }


  // -------------------------------------------------- Lesson Functions ----------------------------------------------------

  async onAddLesson() {
    const modal = await this.modalController.create({
      component: AddLessonComponent,
      cssClass: 'add-lesson-modal',
      animated: true,
      backdropDismiss: false,
      componentProps: {
        id: this.course.id,
        lessonNumber: this.getLessonNumber()
      }
    });
    modal.onDidDismiss<Lesson>().then( data => {
      if(data.data !== null  && data.data ) {
        ++this.course.courseLessons;
        this.course.lessons.push(data.data);
      }
    });
    return await modal.present();
  }

  async onEditLesson(lesson: Lesson) {
    const modal = await this.modalController.create({
      component: EditLessonComponent,
      cssClass: 'edit-lesson-modal',
      animated: true,
      backdropDismiss: false,
      componentProps: {
        lesson
      }
    });
     modal.onDidDismiss<Lesson>().then( data => {
      if(data.data !== null  && data.data) {
        this.course.lessons[this.course.lessons.indexOf(lesson)] = data.data;
      }
    });
    return await modal.present();
  }

  onReorder(event: any) {
    this.course.lessons = event.detail.complete(this.course.lessons);
    this.course.lessons.forEach((lesson, index) => {
      lesson.lessonNumber = index + 1;
      this.courseService.updateLesson(lesson).subscribe();
    });
  }

  async onRemoveLesson(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'remove-speaker-alert',
      header: 'הסרת שיעור',
      message: `אתה בטוח שברצונך להסיר את השיעור?`,
      mode: 'ios',
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'delete-lesson-alert-btn-cancel',
          handler: () => {
          }
        }, {
          text: 'אישור',
          handler: () => {
            this.courseService.removeLesson(id).subscribe(() => {
              const lessonNum = this.course.lessons.find(u => u.id === id).lessonNumber;
              this.course.lessons = this.course.lessons.filter(u => u.id !== id);
              this.course.lessons.forEach((course, index) => {
                course.lessonNumber = index + 1;
              });
              this.appService.presentToast('הנואם הוסר בהצלחה', true);
            }, error => {
              console.log(error);
              this.appService.presentToast('חלה תקלה הנואם לא הוסר', false);
            });
          }
        }
      ]
    });
    await alert.present();
  }


  // -------------------------------------------------- Utilities Functions -------------------------------------------------

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.updateImage = imageFile;
  }

  getLessonNumber(){
    if(this.course.lessons && this.course.lessons !== null) {
      return this.course.lessons.length + 1;
    }
    return 1;
  }

  isEquals(course1: Course, course2: Course) {
    if(
      course1.title === course2.title &&
      course1.description === course2.description
    ) {
      return true;
    }
    return  false;
  }

  onCancel() {
    this.appService.presentToast('הפעולה בוטלה', true);
      this.router.navigate(['/manage/courses']);
  }

}
