import { Component, OnInit } from '@angular/core';
import { Course } from '../course.model';
import { Lesson } from '../lesson.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CourseService } from '../course.service';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.page.html',
  styleUrls: ['./course-detail.page.scss'],
})
export class CourseDetailPage implements OnInit {

  course :Course;
  lessons :Lesson[];
  courseId;
  author: User;
  isLoading = false;
  lessonsIsLoading = false;

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
        this.navController.navigateBack('/tabs/course');
        return;
      }
      this.courseId = paramMap.get('id');
      this.courseService.getCourse(paramMap.get('id')).subscribe(course => {
            this.course = course;
            this.userService.getUser(this.course?.authorId).subscribe(user => {
              this.author = user;
              this.isLoading = false;
            });
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
                      this.router.navigate(['/tabs/course']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
        this.lessonsIsLoading = true;
      this.courseService.getCourseLessons(paramMap.get('id')).subscribe(lessons => {
          this.lessons = lessons;
          this.lessonsIsLoading = false;
        });
    });
  }

  getAuthorFullName() {
    return this.author?.firstName + ' ' + this.author?.lastName;
  }

}
