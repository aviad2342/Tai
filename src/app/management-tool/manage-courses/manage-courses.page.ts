import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColumnMode, SelectionType, DatatableComponent } from 'projects/swimlane/ngx-datatable/src/public-api';
import { ModalController, AlertController } from '@ionic/angular';
import { AppService } from '../../app.service';
import { CourseService } from '../../course/course.service';
import { Course } from '../../course/course.model';
import { Lesson } from '../../course/lesson.model';
import { Router } from '@angular/router';
import { AddLessonComponent } from './add-lesson/add-lesson.component';
import { EditLessonComponent } from './edit-lesson/edit-lesson.component';
import { DataTableFooterComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-manage-courses',
  templateUrl: './manage-courses.page.html',
  styleUrls: ['./manage-courses.page.scss'],
})
export class ManageCoursesPage implements OnInit, OnDestroy {

  courses: Course[];
  lessons: Lesson[];
  selectedCourseId;
  private courseSubscription: Subscription;
  private lessonSubscription: Subscription;
   @ViewChild('coursesTable') coursesTable: DatatableComponent;
  isRowSelected = false;
  reorderable = true;
  loadingIndicator = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor( private courseservice: CourseService,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.courseSubscription = this.courseservice.courses.subscribe(courses => {
        this.courses = courses;
        this.temp = [...this.courses];
      });
      this.lessonSubscription = this.courseservice.lessons.subscribe(lessons => {
        this.lessons = lessons;
      });
    }

    ionViewWillEnter() {
      this.courseservice.getCourses().subscribe(courses => {
        if(this.selectedCourseId && this.selectedCourseId !== '' && this.selectedCourseId !== null ) {
          this.selected = [];
          const course = courses.find(u => u.id === this.selectedCourseId);
          this.selected.push(course);
          this.courseservice.getCourseLessons(this.selectedCourseId).subscribe();
        }
      });
    }

// -------------------------------------------------- Course Functions ----------------------------------------------------

filterCourses(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.temp.filter((d)=> {
    return d.title.toLowerCase().indexOf(val) !== -1 || !val;
   });
 this.courses = temp;
  }

async onAddCourse() {
  this.selectedCourseId = null;
  this.isRowSelected = false;
  this.router.navigate(['manage', 'courses', 'new']);
}

async onViewCourse() {
  this.router.navigate(['manage', 'courses', 'view', this.selectedCourseId]);
}

async onEditCourse() {
  this.router.navigate(['manage', 'courses', 'edit', this.selectedCourseId]);
}

async onDeleteCourse() {
    const alert = await this.alertController.create({
      cssClass: 'delete-course-alert',
      header: 'אישור מחיקת קורס',
      message: `האם אתה בטוח שברצונך למחוק את קורס לצמיתות?`,
      mode: 'ios',
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'delete-course-alert-btn-cancel',
          handler: () => {
          }
        }, {
          text: 'אישור',
          handler: () => {
            this.courseservice.deleteCourse(this.selectedCourseId).subscribe( () => {
              this.isRowSelected = false;
              this.selectedCourseId = null;
              this.selected = [];
              this.appservice.presentToast('הקורס נמחק בהצלחה!', true);
            }, error => {
              this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
            });
          }
        }
      ]
    });
    await alert.present();
}


// -------------------------------------------------- Lesson Functions ----------------------------------------------------

async onAddLesson() {
  const modal = await this.modalController.create({
    component: AddLessonComponent,
    cssClass: 'add-lesson-modal',
    animated: true,
    backdropDismiss: false,
    componentProps: {
      id: this.selectedCourseId,
      lessonNumber: this.getLessonNumber()
    }
  });
   modal.onDidDismiss().then( data => {
    if(data.data !== null  && data.data) {
      this.courseservice.getCourseLessons(this.selectedCourseId).subscribe();
      this.courseservice.getCourses().subscribe(courses => {
        this.selected[0] = courses.find(u => u.id === this.selectedCourseId);
      });
    }
  });
  return await modal.present();
}

onViewLesson(id: string) {
  this.router.navigate(['manage', 'courses', 'lesson', id]);
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
   modal.onDidDismiss().then( data => {
    if(data.data !== null  && data.data) {
      this.courseservice.getCourseLessons(this.selectedCourseId).subscribe();
      this.courseservice.getCourses().subscribe(courses => {
        this.selected[0] = courses.find(u => u.id === this.selectedCourseId);
      });
    }
  });
  return await modal.present();
}

async onDeleteLesson(id: string) {
  const alert = await this.alertController.create({
    cssClass: 'delete-lesson-alert',
    header: 'אישור מחיקת שיעור',
    message: `האם אתה בטוח שברצונך למחוק את השיעור לצמיתות?`,
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
          this.courseservice.deleteLesson(id, this.selectedCourseId).subscribe(delRes => {
            this.courseservice.getCourses().subscribe(courses => {
              this.selected[0] = courses.find(u => u.id === this.selectedCourseId);
            });
            this.appservice.presentToast('השיעור נמחק בהצלחה!', true);
          }, error => {
            this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
          });
        }
      }
    ]
  });
  await alert.present();
}


// -------------------------------------------------- Utilities Functions -------------------------------------------------

  onSelect({ selected }) {
    if(this.selectedCourseId === selected[0].id) {
      this.selected = [];
      selected = [];
      this.selectedCourseId = '';
      this.isRowSelected = false;
    } else {
      this.loadingIndicator = true;
     this.lessonSubscription = this.courseservice.getCourseLessons(selected[0].id).subscribe(lessons => {
        this.lessons = lessons;
        this.loadingIndicator = false;
        this.isRowSelected = true;
      });
      this.selectedCourseId = selected[0].id;
    }
  }

  getVideoThumbnail(videoId: string){
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  getLessonNumber(){
    if(this.lessons && this.lessons !== null) {
      return this.lessons.length + 1;
    }
    return 1;
  }

  ngOnDestroy() {
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
    }
    if (this.lessonSubscription) {
      this.lessonSubscription.unsubscribe();
    }
  }

}
