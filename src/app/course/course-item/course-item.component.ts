import { Component, OnInit, Input } from '@angular/core';
import { Course } from '../course.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss'],
})
export class CourseItemComponent implements OnInit {

  @Input() course: Course;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
