import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course.model';
import { User } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
})
export class CourseItemComponent implements OnInit {

  @Input() course: Course;
  // author: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // this.userService.getUser(this.course.authorId).subscribe(user => {
    //   this.author = user;
    // });
  }

  // getAuthorFullName() {
  //   return this.author?.firstName + ' ' + this.author?.lastName;
  // }

}
