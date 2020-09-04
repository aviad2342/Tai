import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { CourseService } from 'src/app/course/course.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { Course } from 'src/app/course/course.model';
import { Lesson } from 'src/app/course/lesson.model';
import { AddLessonComponent } from '../add-lesson/add-lesson.component';
import { Subscription } from 'rxjs';

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
  selector: 'app-add-course',
  templateUrl: './add-course.page.html',
  styleUrls: ['./add-course.page.scss'],
})
export class AddCoursePage implements OnInit, OnDestroy {

  @ViewChild('stepper') newCourseStepper: IonSlides;
  @ViewChild('f', { static: true }) form: NgForm;
  course: Course;
  lessons: Lesson[];
  file: File;
  private lessonsSubscription: Subscription;
  authorId: string;
  authorName: string;
  isLoading = false;
  lessonsIsLoading = false;

  slideOpts = {
    allowSlidePrev: false,
    allowTouchMove: false
  };

  constructor(
    private courseService: CourseService,
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService,
    public appService: AppService
    ) { }

  ngOnInit() {
    this.authService.getUserLogged().subscribe(author => {
      this.authorId = author.id;
      this.authorName = author.firstName + ' ' + author.lastName;
    });
    this.lessonsSubscription = this.courseService.lessons.subscribe( lessons => {
      this.lessons = lessons;
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
    this.file = imageFile;
    this.form.value.image = imageFile;
  }

  onSubmit(form: NgForm) {
    form.value.image = this.file;
    if (!form.valid || !form.value.image) {
      return;
    }
    this.courseService.uploadCourseThumbnail(form.value.image, 'course')
    .pipe(
      switchMap(uploadRes => {
        const courseToAdd = new Course(
          null,
          this.authorId,
          this.authorName,
          'bb22',
          form.value.title,
          form.value.description,
          new Date(),
          new Date(),
          uploadRes.imageUrl,
          0
        );
        return this.courseService.addCourse(courseToAdd);
      })
    ).subscribe(newCourse => {
      this.course = newCourse;
      this.newCourseStepper.slideNext();
      form.reset();
      // console.log(newCourse);
      // this.course = newCourse;
      // this.bla = newCourse;
      // form.reset();
      // this.appService.presentToast('המאמר נשמר בהצלחה', true);
      // this.router.navigate(['/tabs/article']);
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי המאמר לא נשמרו', false);
      this.router.navigate(['/manage/courses']);
    }
    );
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
        this.courseService.getCourseLessons(this.course.id).subscribe();
      }
    });
    return await modal.present();
  }

  onSaveAndExit() {
    if(this.lessons !== null) {
      this.course.courseLessons = this.lessons.length;
      this.courseService.updateCourse(this.course).subscribe(resData => {
        this.appService.presentToast('השיעור נשמר בהצלחה', true);
        this.router.navigate(['/manage/courses']);
      }, error => {
        this.appService.presentToast('חלה תקלה השיעור לא נשמר', false);
        this.router.navigate(['/manage/courses']);
      });
    }
    this.router.navigate(['/manage/courses']);
  }

  next(){
    this.newCourseStepper.slideNext();
  }

  getLessonNumber(){
    if(this.lessons !== null) {
      return this.lessons.length + 1;
    }
    return 1;
  }

  ngOnDestroy() {
    if (this.lessonsSubscription) {
      this.lessonsSubscription.unsubscribe();
    }
  }

}
