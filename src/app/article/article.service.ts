import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Article } from './article.model';
import { Comment } from './comment.model';
import { User } from '../user/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

    // tslint:disable-next-line: variable-name
    private _articles = new BehaviorSubject<Article[]>([
      new Article(
        '1',
        '8b36691a-a8d0-420b-881c-8d056683bb98',
        'aa12',
        'חזרה לאמא אדמה',
        'מאיפה הגענו ולאן אנו הולכים',
        '  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהםהגישה הזאת אומרת שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם.',
        new Date(),
        new Date(),
        'https://images.wsj.net/im-101142?width=620&size=1.5',
        30,
        3
        ),
        new Article(
          '2',
          '8b36691a-a8d0-420b-881c-8d056683bb98',
          'aa12',
          'חזרה לאמא אדמה',
          'מאיפה הגענו ולאן אנו הולכים',
          '  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהםהגישה הזאת אומרת שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם.',
          new Date(),
          new Date(),
          'https://images.wsj.net/im-101142?width=620&size=1.5',
          30,
          3
          ),
          new Article(
            '3',
            '8b36691a-a8d0-420b-881c-8d056683bb98',
            'aa12',
            'חזרה לאמא אדמה',
            'מאיפה הגענו ולאן אנו הולכים',
            '  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהםהגישה הזאת אומרת שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם.',
            new Date(),
            new Date(),
            'https://images.wsj.net/im-101142?width=620&size=1.5',
            30,
            3
            ),
            new Article(
              '4',
              '8b36691a-a8d0-420b-881c-8d056683bb98',
              'aa12',
              'חזרה לאמא אדמה',
              'מאיפה הגענו ולאן אנו הולכים',
              '  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהםהגישה הזאת אומרת שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם.',
              new Date(),
              new Date(),
              'https://images.wsj.net/im-101142?width=620&size=1.5',
              30,
              3
              )

    ]);

    // tslint:disable-next-line: variable-name
    private _comments = new BehaviorSubject<Comment[]>([
      new Comment('1', '1', '001fe71a-f9e3-4f8a-8df5-d67807349efc', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('2', '1', '7bec4c08-5841-4eb3-8a98-e629c5d86e37', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('3', '2', '001fe71a-f9e3-4f8a-8df5-d67807349efc', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('4', '3', '001fe71a-f9e3-4f8a-8df5-d67807349efc', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('5', '3', '17bec4c08-5841-4eb3-8a98-e629c5d86e37', 'אהבתי את התוכן והכתיבה', new Date()),
    ]);


    get articles() {
      return this._articles.asObservable();
    }

    get comments() {
      return this._comments.asObservable();
    }

    constructor(private http: HttpClient ) { }

    getArticle(id: string) {
      return this.articles.pipe(
        take(1),
        map(articles => {
          return { ...articles.find(p => p.id === id) };
        })
      );
    }

    getComments(articleId: string) {
      return this.comments.pipe(
        map(comments => {
          return { ...comments.filter(p => p.articleId === articleId) };
        })
      );
    }


    addArticle(article: Article) {
    }


    uploadArticleThumbnail(image: File, fileName: string) {
      const uploadData = new FormData();
      uploadData.append('image', image, fileName);
      return this.http.post<{ imageUrl: string}>(
        'http://localhost:3000/api/image/uploadArticleImage',
        uploadData
      );
    }
}
