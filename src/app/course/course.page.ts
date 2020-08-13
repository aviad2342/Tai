import { Component, OnInit, OnDestroy } from '@angular/core';
import { Course } from './course.model';
import { Subscription } from 'rxjs';
import { CourseService } from './course.service';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit, OnDestroy {

  courses: Course[];
  private courseSubscription: Subscription;
  isDesktop: boolean;

  constructor(private courseService: CourseService, private appService: AppService, private authService: AuthService) { }

  ngOnInit() {
    this.courseSubscription = this.courseService.courses.subscribe(courses=> {
      this.courses = courses;
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    // this.courseService.getCourses().subscribe();
  }

  isArticleAuthor(authorId: string) {
    return this.authService.isTheCurrentUserLogged(authorId);
  }

  onDelete(id: string) {
  }

  ngOnDestroy() {
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
    }
  }

}
