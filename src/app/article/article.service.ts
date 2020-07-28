import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Article } from './article.model';
import { Comment } from './comment.model';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

    // tslint:disable-next-line: variable-name
    private _articles = new BehaviorSubject<Article[]>([
      new Article(
        '1',
        'aa12',
        'חזרה לאמא אדמה',
        'מאיפה הגענו ולאן אנו הולכים',
        'הגישה הזאת אומרת שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם.',
        new Date(),
        'https://images.wsj.net/im-101142?width=620&size=1.5',
        30,
        new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg'
        ),
        [new Comment('1', '1', 'אהבתי את התוכן והכתיבה', new Date(), new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg')
        ),
        new Comment('1', '1', 'אהבתי את התוכן והכתיבה', new Date(), new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg') )]
      ),
      new Article(
        '2',
        'aa12',
        'חזרה לאמא אדמה',
        'מאיפה הגענו ולאן אנו הולכים',
        'הגישה הזאת אומרת שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם.',
        new Date(),
        'https://images.wsj.net/im-101142?width=620&size=1.5',
        30,
        new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg'
        ),
        [new Comment('1', '1', 'אהבתי את התוכן והכתיבה', new Date(), new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg')
        ),
        new Comment('1', '1', 'אהבתי את התוכן והכתיבה', new Date(), new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg') )]
      ),
      new Article(
        '3',
        'aa12',
        'חזרה לאמא אדמה',
        'מאיפה הגענו ולאן אנו הולכים',
        '  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם  שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהםהגישה הזאת אומרת שעלינו לנהל את הבעיות הרגשיות שלנו וכי הבעיות בכלל קיימות וחיינו לא מושלמים כיפשוט עוד לא התחלנו לפקח עליהם.',
        new Date(),
        'https://images.wsj.net/im-101142?width=620&size=1.5',
        30,
        new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg'
        ),
        [new Comment('1', '1', 'אהבתי את התוכן והכתיבה', new Date(), new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg')
        ),
        new Comment('1', '1', 'אהבתי את התוכן והכתיבה', new Date(), new User(
          '7bec4c08-5841-4eb3-8a98-e629c5d86e37',
          'אביעד',
          'בן חיון',
          'aviad2342',
          '0525371804',
          'aviad@walla.com',
          new Date('2015-02-04'),
          'ישראל',
          'בנימינה',
          'רותם',
          '3',
          '0',
          '0',
          'http://localhost:3000/images/aviad2342@.jpg') )]
      )
    ]);

    get articles() {
      return this._articles.asObservable();
    }

    constructor() { }

    getArticle(id: string) {
      return this.articles.pipe(
        take(1),
        map(articles => {
          return { ...articles.find(p => p.id === id) };
        })
      );
    }
}
