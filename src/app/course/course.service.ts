import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from './course.model';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { Lesson } from './lesson.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  // tslint:disable-next-line: variable-name
  private _courses = new BehaviorSubject<Course[]>([]);

  // tslint:disable-next-line: variable-name
  private _lessons = new BehaviorSubject<Lesson[]>([]);


  get courses() {
    return this._courses.asObservable();
  }

  get lessons() {
    return this._lessons.asObservable();
  }

  constructor( private http: HttpClient ) { }

  // getCourse(id: string) {
  //   return this._courses.pipe(
  //     take(1),
  //     map(courses => {
  //       return { ...courses.find(p => p.id === id) };
  //     })
  //   );
  // }

// ------------------------------------------ Course Functions --------------------------------------------------
  getCourses() {
    return this.http.get<Course[]>('http://localhost:3000/api/course/courses')
    .pipe(tap(resDta => {
      this._courses.next(resDta);
    }));
  }

  getCourse(id: string) {
    return this.http.get<Course>(`http://localhost:3000/api/course/course/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  // addCourse(course: Course) {
  //   return this.http.post<{id: string}>('http://localhost:3000/api/course/course',
  //   {
  //     ...course
  //   }).
  //   pipe(
  //     switchMap(resData => {
  //       course.id = resData.id;
  //       return this.courses;
  //     }),
  //     take(1),
  //     tap(courses => {
  //       this._courses.next(courses.concat(course));
  //     }));
  // }

  // addCourse(course: Course) {
  //   return this.http.post<Course>('http://localhost:3000/api/course/course',
  //   {
  //     ...course
  //   }).
  //   pipe(
  //     switchMap(resData => {
  //       course.id = resData.id;
  //       return this.courses;
  //     }),
  //     take(1),
  //     switchMap(courses => {
  //       this._courses.next(courses.concat(course));
  //        return courses;
  //     }),
  //     tap(courses => {
  //        return courses;
  //     }
  //   ));
  // }

  addCourse(course: Course) {
    return this.http.post<Course>('http://localhost:3000/api/course/course',
    {
      ...course
    }).
    pipe(
      switchMap(resData => {
        course.id = resData.id;
        return this.courses;
      }),
      take(1),
      switchMap(cours => {
        this._courses.next(cours.concat(course));
         return this.getCourse(course.id);
      }));
  }

  updateCourse(course: Course) {
    const courseObj = {
      authorId: course.authorId,
      authorName: course.authorName,
      catalogNumber: course.catalogNumber,
      title: course.title,
      description: course.description,
      date: course.date,
      lastEdit: course.lastEdit,
      thumbnail: course.thumbnail,
      courseLessons: course.courseLessons
      };
    return this.http.put(`http://localhost:3000/api/course/course/${course.id}`,
    {
      ...courseObj
    }).
    pipe(
      switchMap(resData => {
        return this.getCourses();
      }),
      tap(courses => {
        this._courses.next(courses);
      }));
  }

  deleteCourse(id: string) {
    return this.http.delete(`http://localhost:3000/api/course/course/${id}`).
    pipe(
      switchMap(resData => {
        return this.getCourses();
      }),
      tap(courses => {
        this._courses.next(courses.filter(u => u.id !== id));
      }));
  }

  // getCourseLessons(courseId: string) {
  //   return this.lessons.pipe(
  //     map(lessons => {
  //       return lessons.filter(p => p.courseId === courseId);
  //     })
  //   );
  // }

  getCourseLessons(course: string) {
    return this.http.get<Lesson[]>( `http://localhost:3000/api/lesson/lesson/course/${course}`)
      .pipe(tap(lessons => {
        this._lessons.next(lessons);
      }));
  }

  getLessonsOfCourse(id: string) {
    return this.http.get<Lesson[]>( `http://localhost:3000/api/lesson/lesson/lessons/${id}`)
      .pipe(tap(lessons => {
        return lessons;
      }));
  }

  uploadCourseThumbnail(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      'http://localhost:3000/api/image/uploadCourseImage',
      uploadData
    );
  }

 // ------------------------------------------ Lesson Functions --------------------------------------------------

  // getLesson(id: string) {
  //   return this._lessons.pipe(
  //     take(1),
  //     map(lessons => {
  //       return { ...lessons.find(p => p.id === id) };
  //     })
  //   );
  // }

  getLessons() {
    return this.http.get<Lesson[]>('http://localhost:3000/api/lesson/lessons')
    .pipe(tap(resDta => {
      this._lessons.next(resDta);
    }));
  }

  getLesson(id: string) {
    return this.http.get<Lesson>(`http://localhost:3000/api/lesson/lesson/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addLesson(lesson: Lesson) {
    return this.http.post<Lesson>('http://localhost:3000/api/lesson/lesson',
    {
      ...lesson
    }).
    pipe(tap(resDta => {
      return resDta;
    }));
  }

  updateLesson(lesson: Lesson) {
    const lessonObj = {
      authorName: lesson.videoId,
      catalogNumber: lesson.videoURL,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      description: lesson.description,
      date: lesson.date,
      thumbnail: lesson.thumbnail,
      course: lesson.course
      };
    return this.http.put<Lesson>(`http://localhost:3000/api/lesson/lesson/${lesson.id}`,
    {
      ...lessonObj
    }).
    pipe(tap(resDta => {
      this.getCourseLessons(resDta.course);
      return resDta;
    }));
  }

  reorderLessons(fromId: string, toId: string) {
    return this.http.get(`http://localhost:3000/api/lesson/lesson/reorder/${fromId}/${toId}`).
    pipe(
      switchMap(resData => {
        return this.lessons;
      }),
      tap(lessons => {
        this._lessons.next(lessons);
      }));
  }

  deleteLesson(id: string, courseId: string) {
    return this.http.delete(`http://localhost:3000/api/lesson/lesson/${id}`).
    pipe(
      switchMap(resData => {
        return this.getCourseLessons(courseId);
      }),
      tap(lessons => {
        this._lessons.next(lessons.filter(u => u.id !== id));
      }));
  }

  removeLesson(id: string) {
    return this.http.delete(`http://localhost:3000/api/lesson/lesson/${id}`).
    pipe( tap(resData => {
        return resData;
      }));
  }

  deleteCourseLessons(courseId: string) {
    return this.http.delete(`http://localhost:3000/api/lesson/lesson/courseId/${courseId}`).
    pipe(
      switchMap(resData => {
        return this.getCourseLessons(courseId);
      }),
      tap(lessons => {
        this._lessons.next(lessons.filter(u => u.course !== courseId));
      }));
  }

  getVimeoVideoId(url: string) {
    return this.http.get<{video_id: string}>(`https://vimeo.com/api/oembed.json?url=${url}`).
    pipe(
      map(resData => {
        return resData.video_id;
      }));
  }

  getVimeoVideoThumbnail(url: string) {
    return this.http.get<{thumbnail_url: string}>(`https://vimeo.com/api/oembed.json?url=${url}`).
    pipe(
      map(resData => {
        return resData.thumbnail_url;
      }));
  }

  getYouTubeVideoThumbnail(url: string) {
    return this.http.get<{thumbnail_url: string}>(`https://www.youtube.com/oembed?format=json&url=${url}`).
    pipe(
      map(resData => {
        return resData.thumbnail_url;
      }));
  }

  getVideoThumbnail(videoId: string){
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

}
