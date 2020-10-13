import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { CourseService } from '../../../course/course.service';
import { AuthService } from '../../../auth/auth.service';
import { AppService } from '../../../app.service';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { Course } from '../../../course/course.model';
import { Lesson } from '../../../course/lesson.model';
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
  selector: 'app-add-course',
  templateUrl: './add-course.page.html',
  styleUrls: ['./add-course.page.scss'],
})
export class AddCoursePage implements OnInit {

  @ViewChild('stepper') newCourseStepper: IonSlides;
  @ViewChild('f', { static: true }) form: NgForm;
  course: Course;
  file: File;
  authorId: string;
  authorName: string;
  isLoading = false;
  lessonsIsLoading = false;

  slideOpts = {
    allowSlidePrev: false,
    allowTouchMove: false,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction'
    }
  };

  constructor(
    private courseService: CourseService,
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    public appService: AppService
    ) { }

  ngOnInit() {
    this.lessonsIsLoading = true;
    this.authService.getUserLogged().subscribe(author => {
      this.authorId = author.id;
      this.authorName = author.firstName + ' ' + author.lastName;
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
          0,
          []
        );
        this.isLoading = true;
        return this.courseService.addCourse(courseToAdd);
      })
    ).subscribe(newCourse => {
      this.course = newCourse;
      this.isLoading = false;
      this.lessonsIsLoading = false;
      this.newCourseStepper.slideNext();
    }, error => {
      form.reset();
      this.appService.presentToast('חלה תקלה פרטי הקורס לא נשמרו', false);
      this.router.navigate(['/manage/courses']);
    }
    );
  }

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
        this.course.lessons.push(data.data);
      }
    });
    return await modal.present();
  }

  async onDeleteLesson(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'delete-lesson-alert',
      header: 'אישור מחיקת שיעור',
      message: `האם אתה בטוח שברצונך למחוק את השיעור לצמיתות?`,
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
            this.courseService.deleteLesson(id, this.course.id).subscribe(lessons => {
              this.course.lessons = this.course.lessons.filter(c => c.id !== id);
              this.appService.presentToast('השיעור נמחק בהצלחה!', true);
            }, error => {
              this.appService.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async onSaveAndExit() {
    if(this.course.lessons !== null && this.course.lessons && this.course.lessons.length > 0) {
      this.appService.presentToast('השיעור נשמר בהצלחה', true);
        this.router.navigate(['/manage/courses']);
    } else {
      const alert = await this.alertController.create({
        cssClass: 'no-class-added-alert',
        header: 'לא נוספו שיעורים',
        mode: 'ios',
        backdropDismiss: false,
        message: 'נראה שלא הוספת שיעורים לקורס זה! האם ברצונך לבטל את יצירת הקורס? לשמור את הקורס ללא שיעורים או להוסיף שיעורים?',
        buttons: [
          {
            text: 'בטל יצירת קורס',
            role: 'cancel',
            cssClass: 'delete-course-alert-btn-cancel',
            handler: () => {
              this.courseService.deleteCourse(this.course.id).subscribe(() => {
                this.appService.presentToast('בוטלה פעולת השמירה והקורס נמחק!', true);
                this.router.navigate(['/manage/courses']);
              });
            }
          }, {
            text: 'הוסף שיעורים',
            handler: () => {
              this.onAddLesson();
              return;
            }
          }, {
            text: 'שמור קורס',
            handler: () => {
              this.appService.presentToast('הקורס נשמר בהצלחה!', true);
              this.router.navigate(['/manage/courses']);
            }
          }
        ]
      });
      await alert.present();
    }
  }

  next(){
    this.newCourseStepper.slideNext();
  }

  getLessonNumber(){
    if(this.course.lessons && this.course.lessons !== null) {
      return this.course.lessons.length + 1;
    }
    return 1;
  }

  onCancel() {
    this.form.reset();
    this.appService.presentToast('הפעולה בוטלה', true);
    this.router.navigate(['/manage/courses']);
  }

}
