import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/course/course.service';
import { NavController, ModalController, IonReorderGroup } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Course } from 'src/app/course/course.model';
import { switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Lesson } from 'src/app/course/lesson.model';
import { AddLessonComponent } from '../add-lesson/add-lesson.component';

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
  id: string;
  @ViewChild('f', { static: true }) form: NgForm;
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  file: File;
  isLoading = false;
  lessonsIsLoading = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private navCtrl: NavController,
    private router: Router,
    private modalController: ModalController,
    public appService: AppService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/manage/courses');
        return;
      }
      this.id = paramMap.get('id');
      this.courseService.getCourse(paramMap.get('id')).
      subscribe(course => {
        this.course = course;
        const coursebj = {
          title: this.course.title,
          description: this.course.description
          };
        this.form.setValue(coursebj);
      });
      this.lessonsIsLoading = true;
      this.courseService.getCourseLessons(paramMap.get('id')).subscribe(lessons => {
        this.lessons = lessons;
        this.lessonsIsLoading = false;
      });
    });
  }

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
    // this.file = imageFile;
    this.form.value.image = imageFile;
  }

  async onAddLesson() {
    const modal = await this.modalController.create({
      component: AddLessonComponent,
      cssClass: 'add-lesson-modal',
      animated: true,
      componentProps: {
        id: this.course.id,
        lessonNumber: this.getLessonNumber()
      }
    });
    modal.onDidDismiss().then( data => {
      if(data.data.didAdd) {
        this.courseService.getCourseLessons(this.course.id).subscribe(lessons => {
          this.lessons = lessons;
          const courseToUpdate: Course = this.course;
          courseToUpdate.courseLessons = lessons.length;
          courseToUpdate.lastEdit = new Date();
          this.courseService.updateCourse(courseToUpdate).subscribe();
          this.appService.presentToast('השיעור נוסף בהצלחה!', true);
        }, error => {
          this.appService.presentToast('חלה תקלה פעולת ההוספה נכשלה!', false);
        });
      }
    });
    return await modal.present();
  }

   onReorder(event: any) {
    this.lessons = event.detail.complete(this.lessons);
    this.lessons.forEach((lesson, index) => {
      lesson.lessonNumber = index + 1;
      this.courseService.updateLesson(lesson).subscribe();
    });
  }

  onSubmit(form: NgForm) {
    // form.value.image = this.file;
    if (!form.valid) {
      return;
    }
    if (form.value.image) {
    this.courseService.uploadCourseThumbnail(form.value.image, 'course')
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
          this.lessons.length
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
      this.lessons.length
    );
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

  getLessonNumber(){
    if(this.lessons !== null) {
      return this.lessons.length + 1;
    }
    return 1;
  }

}
