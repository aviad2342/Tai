import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColumnMode, SelectionType, DatatableComponent } from 'projects/swimlane/ngx-datatable/src/public-api';
import { ModalController, AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { CourseService } from 'src/app/course/course.service';
import { Course } from 'src/app/course/course.model';
import { Lesson } from 'src/app/course/lesson.model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AddLessonComponent } from './add-lesson/add-lesson.component';

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
        if(this.selectedCourseId !== null) {
          this.selected[0] = courses.find(u => u.id === this.selectedCourseId);
          this.courseservice.getCourseLessons(this.selectedCourseId).subscribe();
        }
      });
    }

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

  async onAddLesson() {
    const modal = await this.modalController.create({
      component: AddLessonComponent,
      cssClass: 'add-lesson-modal',
      animated: true,
      componentProps: {
        id: this.selectedCourseId,
        lessonNumber: this.getLessonNumber()
      }
    });
     modal.onDidDismiss().then( data => {
      if(data.data.didAdd) {
        this.courseservice.getCourseLessons(this.selectedCourseId).subscribe(lessons => {
          // this.lessons = lessons;
        });
        const courseToUpdate: Course = this.selected[0];
        courseToUpdate.courseLessons = this.lessons.length;
        courseToUpdate.lastEdit = new Date();
        this.courseservice.updateCourse(courseToUpdate).subscribe(courses => {
          this.selected[0] = courses.find(u => u.id === this.selectedCourseId);
          this.appservice.presentToast('השיעור נוסף בהצלחה!', true);
        }, error => {
          this.appservice.presentToast('חלה תקלה פעולת ההוספה נכשלה!', false);
        });
      }
    });
    return await modal.present();
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
        message: `האם אתה בטוח שברצונך למחוק את קורס ${this.selected[0].title} לצמיתות?`,
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
              this.courseservice.deleteCourseLessons(this.selectedCourseId)
              .pipe(
                switchMap( resData => {
                  return this.courseservice.deleteCourse(this.selectedCourseId);
                })
              ).subscribe( () => {
                this.isRowSelected = false;
                this.selectedCourseId = null;
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

  onViewLesson(id: string) {
    console.log(id);
  }

  onEditLesson(id: string) {
    console.log(id);
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
            this.courseservice.deleteLesson(id, this.selectedCourseId).subscribe(delRes => {
              this.courseservice.getCourse(this.selectedCourseId).subscribe(course => {
                course.courseLessons = this.lessons.length;
                course.lastEdit = new Date();
                this.courseservice.updateCourse(course).subscribe(courses => {
                  this.selected[0] = courses.find(u => u.id === this.selectedCourseId);
                });
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

  onSelect({ selected }) {
    if(this.selectedCourseId === selected[0].id) {
      this.selected = [];
      this.selectedCourseId = '';
      this.isRowSelected = false;
    } else {
     this.lessonSubscription = this.courseservice.getCourseLessons(selected[0].id).subscribe(lessons => {
        this.lessons = lessons;
        this.isRowSelected = true;
      });
      this.selectedCourseId = selected[0].id;
      console.log('Select Event', selected[0], this.selected[0].id);
    }
  }

  getVideoThumbnail(videoId: string){
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }

  onActivate(event) {
    // console.log('Activate Event', event);
  }

  getLessonNumber(){
    if(this.lessons !== null) {
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
