import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { Article } from './article.model';
import { Comment } from './comment.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

    // tslint:disable-next-line: variable-name
    private _articles = new BehaviorSubject<Article[]>([]);

    // tslint:disable-next-line: variable-name
    private _comments = new BehaviorSubject<Comment[]>([
      new Comment('1', '1', '001fe71a-f9e3-4f8a-8df5-d67807349efc', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('2', '1', '7bec4c08-5841-4eb3-8a98-e629c5d86e37', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('3', '2', '001fe71a-f9e3-4f8a-8df5-d67807349efc', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('4', '3', '001fe71a-f9e3-4f8a-8df5-d67807349efc', 'אהבתי את התוכן והכתיבה', new Date()),
      new Comment('5', '3', '17bec4c08-5841-4eb3-8a98-e629c5d86e37', 'אהבתי את התוכן והכתיבה', new Date())
    ]);


    get articles() {
      return this._articles.asObservable();
    }

    get comments() {
      return this._comments.asObservable();
    }

    constructor(private http: HttpClient ) { }

    getArticles() {
      return this.http.get<Article[]>('http://localhost:3000/api/article/articles')
      .pipe(tap(resDta => {
        this._articles.next(resDta);
      }));
    }

    getArticle(id: string) {
      return this.http.get<Article>(`http://localhost:3000/api/article/article/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    addArticle(article: Article) {
      return this.http.post<{id: string}>('http://localhost:3000/api/article/article',
      {
        ...article
      }).
      pipe(
        switchMap(resData => {
          article.id = resData.id;
          return this.articles;
        }),
        take(1),
        tap(articles => {
          this._articles.next(articles.concat(article));
        }));
    }

    updateArticle(article: Article) {
      const articleObj = {
         authorId: article.authorId,
         catalogNumber: article.catalogNumber,
         title: article.title,
         subtitle: article.subtitle,
         body: article.body,
         date: article.date,
         lastEdit: article.lastEdit,
         thumbnail: article.thumbnail,
         views: article.views,
         comments: article.comments
        };
      return this.http.put(`http://localhost:3000/api/article/article/${article.id}`,
      {
        ...articleObj
      }).
      pipe(
        switchMap(resData => {
          return this.getArticles();
        }),
        tap(articles => {
          this._articles.next(articles);
        }));
    }

    deleteUser(id: string) {
      return this.http.delete(`http://localhost:3000/api/article/article/${id}`).
      pipe(
        switchMap(resData => {
          return this.getArticles();
        }),
        tap(articles => {
          this._articles.next(articles.filter(u => u.id !== id));
        }));
    }

    getArticleByUser(authorId: string) {
      return this.http
        .get<Article>(
          `http://localhost:3000/api/article/article/email/${authorId}`)
        .pipe(tap(user => {
          return user;
        }));
    }

    getComments(articleId: string) {
      return this.comments.pipe(
        map(comments => {
          return { ...comments.filter(p => p.articleId === articleId) };
        })
      );
    }

    getCommentss(articleId: string) {
      return this.comments.pipe(
        map(comments => {
          return comments.filter(p => p.articleId === articleId);
        })
      );
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
