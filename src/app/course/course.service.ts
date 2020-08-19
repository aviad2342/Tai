import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from './course.model';
import { map, take } from 'rxjs/operators';
import { Lesson } from './lesson.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  image = 'https://sites.google.com/site/sastag/_/rsrc/1368181356118/guides/overcoming-social-anxiet-step-by-step/tape07/039-accepting-myself-as-iam-right-now/acceptance.jpg?height=176&width=320'
  thumb ='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/YouTube_play_buttom_icon_%282013-2017%29.svg/1280px-YouTube_play_buttom_icon_%282013-2017%29.svg.png';
  // tslint:disable-next-line: variable-name
  private _courses = new BehaviorSubject<Course[]>([
    new Course
    ('1', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
    new Course
    ('2', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
    new Course
    ('3', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
    new Course
    ('4', '8b36691a-a8d0-420b-881c-8d056683bb98', 'ab1', 'השלמה עצמית', 'דרכים לקבלה עצמית', new Date('2020-08-07'), this.image, 4 ),
  ]);

    // tslint:disable-next-line: variable-name
    private _lessons = new BehaviorSubject<Lesson[]>([
      new Lesson
      ('1', '1', 'z1-n2C-8gyA', 'https://www.youtube.com/watch?v=z1-n2C-8gyA', 1, 'כותרת 1', 'תוכן 1',new Date('2020-08-07'), this.thumb),
      new Lesson
      ('1', '1', '_RTe9IhhGTg', 'https://www.youtube.com/watch?v=_RTe9IhhGTg', 2, 'כותרת 1', 'תוכן 1', new Date('2020-08-07'), this.thumb),
      new Lesson
      ('1', '1', '_eoNoXpagNc', 'https://www.youtube.com/watch?v=_eoNoXpagNc', 3,'כותרת 1', 'תוכן 1', new Date('2020-08-07'), this.thumb),
      new Lesson
      ('1', '1', 'pg9tgv7YFLY', 'https://www.youtube.com/watch?v=pg9tgv7YFLY', 4, 'כותרת 1', 'תוכן 1',new Date('2020-08-07'), this.thumb)
    ]);


  get courses() {
    return this._courses.asObservable();
  }

  get lessons() {
    return this._lessons.asObservable();
  }

  constructor() { }

  getCourse(id: string) {
    return this._courses.pipe(
      take(1),
      map(courses => {
        return { ...courses.find(p => p.id === id) };
      })
    );
  }

  getLesson(id: string) {
    return this._lessons.pipe(
      take(1),
      map(lessons => {
        return { ...lessons.find(p => p.id === id) };
      })
    );
  }

  getCourseLessons(courseId: string) {
    return this.lessons.pipe(
      map(lessons => {
        return lessons.filter(p => p.courseId === courseId);
      })
    );
  }

  getVideoThumbnail(videoId: string){
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

}
