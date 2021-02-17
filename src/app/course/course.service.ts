import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from './course.model';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { Lesson } from './lesson.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const LOCALHOST = environment.LOCALHOST;

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  // tslint:disable-next-line: variable-name
  private _courses = new BehaviorSubject<Course[]>([]);

  // tslint:disable-next-line: variable-name
  private _lessons = new BehaviorSubject<Lesson[]>([]);

  // tslint:disable-next-line: variable-name
  private _lesson = new BehaviorSubject<Lesson>(null);


  get courses() {
    return this._courses.asObservable();
  }

  get lessons() {
    return this._lessons.asObservable();
  }

  get lesson() {
    return this._lesson.asObservable();
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
    return this.http.get<Course[]>(`http://${LOCALHOST}:3000/api/course/courses`)
    .pipe(tap(resDta => {
      this._courses.next(resDta);
    }));
  }

  getCourse(id: string) {
    return this.http.get<Course>(`http://${LOCALHOST}:3000/api/course/course/${id}`)
    .pipe(tap(resDta => {
      return resDta;
    }));
  }

  addCourse(course: Course) {
    return this.http.post<Course>(`http://${LOCALHOST}:3000/api/course/course`,
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
    return this.http.put<Course>(`http://${LOCALHOST}:3000/api/course/course/${course.id}`,
    {
      ...courseObj
    }).
    pipe(tap(updatedCourse => {
        this.getCourses();
        return updatedCourse;
      }));
  }

  deleteCourse(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/course/course/${id}`).
    pipe(
      switchMap(resData => {
        return this.getCourses();
      }),
      tap(courses => {
        this._courses.next(courses.filter(u => u.id !== id));
      }));
  }


  getCourseLessons(course: string) {
    return this.http.get<Lesson[]>( `http://${LOCALHOST}:3000/api/lesson/lesson/course/${course}`)
      .pipe(tap(lessons => {
        this._lessons.next(lessons);
      }));
  }

  getLessonsOfCourse(id: string) {
    return this.http.get<Lesson[]>( `http://${LOCALHOST}:3000/api/lesson/lesson/lessons/${id}`)
      .pipe(tap(lessons => {
        return lessons;
      }));
  }

  uploadCourseThumbnail(image: File, fileName: string) {
    const uploadData = new FormData();
    uploadData.append('image', image, fileName);
    return this.http.post<{ imageUrl: string}>(
      `http://${LOCALHOST}:3000/api/image/uploadCourseImage`,
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
    return this.http.get<Lesson[]>(`http://${LOCALHOST}:3000/api/lesson/lessons`)
    .pipe(tap(resDta => {
      this._lessons.next(resDta);
    }));
  }

  getLesson(id: string) {
    return this.http.get<Lesson>(`http://${LOCALHOST}:3000/api/lesson/lesson/${id}`)
    .pipe(tap(resDta => {
      this._lesson.next(resDta);
      return resDta;
    }));
  }

  viewLesson(id: string) {
    return this.http.get<Lesson>(`http://${LOCALHOST}:3000/api/lesson/lesson/${id}`)
    .pipe(tap(resDta => {
      this._lesson.next(resDta);
    }));
  }

  addLesson(lesson: Lesson) {
    return this.http.post<Lesson>(`http://${LOCALHOST}:3000/api/lesson/lesson`,
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
    return this.http.put<Lesson>(`http://${LOCALHOST}:3000/api/lesson/lesson/${lesson.id}`,
    {
      ...lessonObj
    }).
    pipe(tap(resDta => {
      this.getCourseLessons(resDta.course);
      return resDta;
    }));
  }

  reorderLessons(fromId: string, toId: string) {
    return this.http.get(`http://${LOCALHOST}:3000/api/lesson/lesson/reorder/${fromId}/${toId}`).
    pipe(
      switchMap(resData => {
        return this.lessons;
      }),
      tap(lessons => {
        this._lessons.next(lessons);
      }));
  }

  deleteLesson(id: string, courseId: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/lesson/lesson/${id}`).
    pipe(
      switchMap(resData => {
        return this.getCourseLessons(courseId);
      }),
      tap(lessons => {
        this._lessons.next(lessons.filter(u => u.id !== id));
      }));
  }

  removeLesson(id: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/lesson/lesson/${id}`).
    pipe( tap(resData => {
        return resData;
      }));
  }

  deleteCourseLessons(courseId: string) {
    return this.http.delete(`http://${LOCALHOST}:3000/api/lesson/lesson/courseId/${courseId}`).
    pipe(
      switchMap(resData => {
        return this.getCourseLessons(courseId);
      }),
      tap(lessons => {
        this._lessons.next(lessons.filter(u => u.course !== courseId));
      }));
  }

  getVimeoVideoId(url: string) {
    return this.http.get<{video_id: string}>(`http://vimeo.com/api/oembed.json?url=${url}`).
    pipe(
      map(resData => {
        return resData.video_id;
      }));
  }

  getVimeoVideoThumbnail(videoId: string) {
    return this.http.get<{thumbnail_large: string}>(`https://vimeo.com/api/v2/video/${videoId}.json`).
    pipe(
      map(resData => {
        return resData[0].thumbnail_large;
      }));
  }

  getYouTubeVideoThumbnail(url: string) {
    return this.http.get<{thumbnail_url: string}>(`http://www.youtube.com/oembed?format=json&url=${url}`).
    pipe(
      map(resData => {
        return resData.thumbnail_url;
      }));
  }

  getVideoThumbnail(videoId: string){
    return `http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  deleteImage(image: string) {
    const imageParam = new HttpParams();
    imageParam.set('image', image);
    return this.http.delete<{ response: string}>(`http://${LOCALHOST}:3000/api/image/deletImage`, {params: imageParam}).
    pipe(
      map(resData => {
        return resData.response;
      }));
  }

}
