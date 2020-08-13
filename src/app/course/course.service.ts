import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  image = 'https://sites.google.com/site/sastag/_/rsrc/1368181356118/guides/overcoming-social-anxiet-step-by-step/tape07/039-accepting-myself-as-iam-right-now/acceptance.jpg?height=176&width=320'

  // tslint:disable-next-line: variable-name
  private _courses = new BehaviorSubject<Course[]>([
    new Course
    ('1', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
    new Course
    ('1', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
    new Course
    ('1', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
    new Course
    ('1', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
  ]);


  get courses() {
    return this._courses.asObservable();
  }

  constructor() { }
}
