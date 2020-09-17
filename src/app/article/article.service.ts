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
    private _comments = new BehaviorSubject<Comment[]>([]);


    get articles() {
      return this._articles.asObservable();
    }

    get comments() {
      return this._comments.asObservable();
    }

    constructor(private http: HttpClient ) { }

    // ------------------------------------ Comment Services -----------------------------------

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

    deleteArticle(id: string) {
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
          `http://localhost:3000/api/article/article/authorId/${authorId}`)
        .pipe(tap(article => {
          return article;
        }));
    }

    uploadArticleThumbnail(image: File, fileName: string) {
      const uploadData = new FormData();
      uploadData.append('image', image, fileName);
      return this.http.post<{ imageUrl: string}>(
        'http://localhost:3000/api/image/uploadArticleImage',
        uploadData
      );
    }

 // ------------------------------------ Comment Services -----------------------------------

    getComments() {
      return this.http.get<Comment[]>('http://localhost:3000/api/comment/comments')
      .pipe(tap(resDta => {
        this._comments.next(resDta);
      }));
    }

    getComment(id: string) {
      return this.http.get<Comment>(`http://localhost:3000/api/comment/comment/${id}`)
      .pipe(tap(resDta => {
        return resDta;
      }));
    }

    addComment(comment: Comment) {
      return this.http.post<Comment>('http://localhost:3000/api/comment/comment',
      {
        ...comment
      }).
      pipe(tap(resDta => {
        return resDta;
      }));
    }

    updateComment(comment: Comment) {
      const commentObj = {
         article: comment.article,
         authorId: comment.authorId,
         body: comment.body,
         date: comment.date,
        };
      return this.http.put(`http://localhost:3000/api/comment/comment/${comment.id}`,
      {
        ...commentObj
      }).
      pipe(
        switchMap(resData => {
          return this.getComments();
        }),
        tap(comments => {
          this._comments.next(comments);
        }));
    }

    deleteComment(id: string) {
      return this.http.delete(`http://localhost:3000/api/comment/comment/${id}`).
      pipe(
        switchMap(resData => {
          return this.getComments();
        }),
        tap(comments => {
          this._comments.next(comments.filter(u => u.id !== id));
        }));
    }

    // deleteArticleComments(articleId: string) {
    //   return this.http.delete(`http://localhost:3000/api/comment/comment/articleId/${articleId}`).
    //   pipe(
    //     switchMap(resData => {
    //       return this.getComments();
    //     }),
    //     tap(comments => {
    //       this._comments.next(comments.filter(u => u.articleId !== articleId));
    //     }));
    // }

    getArticleComments(articleId: string) {
      return this.http.get<Comment[]>( `http://localhost:3000/api/comment/comment/articleId/${articleId}`)
        .pipe(tap(comments => {
          this._comments.next(comments);
        }));
    }

    getCommentByUser(authorId: string) {
      return this.http
        .get<Comment[]>(
          `http://localhost:3000/api/comment/comment/authorId/${authorId}`)
        .pipe(tap(comments => {
          return comments;
        }));
    }

}
