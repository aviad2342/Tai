import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColumnMode, SelectionType } from 'projects/swimlane/ngx-datatable/src/public-api';
import { ModalController, AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
import { CourseService } from 'src/app/course/course.service';
import { Course } from 'src/app/course/course.model';
import { Lesson } from 'src/app/course/lesson.model';

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
  // @ViewChild('usersTable') usersTable: DatatableComponent;
  isRowSelected = false;
  columnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  selected = [];


  constructor( private courseservice: CourseService,
    private modalController: ModalController,
    private alertController: AlertController,
    private appservice: AppService
    ) { }

    ngOnInit() {
      this.courseSubscription = this.courseservice.courses.subscribe(courses=> {
        this.courses = courses;
        this.temp = [...this.courses];
      });
    }

    ionViewWillEnter() {
      this.courseservice.getCourses().subscribe();
    }

   filterCourses(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d)=> {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
     });
   this.courses = temp;
    }

  async onAddCourse() {
    // const modal = await this.modalController.create({
    //   component: ,
    //   cssClass: 'add-course-modal',
    //   animated: true
    // },);
    // return await modal.present();
  }

  async onViewCourse() {
    // const modal = await this.modalController.create({
    //   component: ,
    //   cssClass: 'view-course-modal',
    //   componentProps: {
    //     id: this.selectedCourseId
    //   }
    // });
    // return await modal.present();
  }

  async onEditCourse() {
    // const modal = await this.modalController.create({
    //   component: ,
    //   cssClass: 'edit-course-modal',
    //   componentProps: {
    //     id: this.selectedCourseId
    //   }
    // });
    //  modal.onDidDismiss().then( data => {
    //   if(data.data.didUpdate) {
    //     this.isRowSelected = false;
    //     this.selectedCourseId = '';
    //   }
    // });
    // return await modal.present();
  }

  async onDeleteCourse() {
      const alert = await this.alertController.create({
        cssClass: 'delete-user-alert',
        header: 'אישור מחיקת משתמש',
        message: `האם אתה בטוח שברצונך למחוק את המשתמש ${this.selectedCourseId} לצמיתות?`,
        buttons: [
          {
            text: 'ביטול',
            role: 'cancel',
            cssClass: 'delete-user-alert-btn-cancel',
            handler: () => {
            }
          }, {
            text: 'אישור',
            handler: () => {
              // this.userservice.deleteUser(this.selectedUserId).subscribe( () => {
              //   this.isRowSelected = false;
              // });
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

  onDeleteLesson(id: string) {
    console.log(id);
  }

  onSelect({ selected }) {
    if(this.selectedCourseId === selected[0].id) {
      this.selected = [];
      this.selectedCourseId = '';
      this.isRowSelected = false;
    } else {
      this.courseservice.getCourseLessons(selected[0].id).subscribe(lessons => {
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


  ngOnDestroy() {
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
    }
  }

}
