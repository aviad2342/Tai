import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CourseService } from '../../../course/course.service';
import { UserService } from '../../../user/user.service';
import { Course } from '../../../course/course.model';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.page.html',
  styleUrls: ['./view-course.page.scss'],
})
export class ViewCoursePage implements OnInit {

  course :Course;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
    private courseService: CourseService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navController.navigateBack('/manage/courses');
        return;
      }
      this.courseService.getCourse(paramMap.get('id')).subscribe(course => {
            this.course = course;
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'ישנה תקלה!',
                message: 'לא ניתן להציג את המאמר.',
                buttons: [
                  {
                    text: 'אישור',
                    handler: () => {
                      this.navController.navigateBack('/manage/courses');
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }

}
