import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit, OnDestroy {

  articles: Article[];
  private articleSubscription: Subscription;
  isDesktop: boolean;

  constructor(
    private articleService: ArticleService,
    private appService: AppService,
    private authService: AuthService,
    private appservice: AppService
     ) { }

  ngOnInit() {
    this.articleSubscription = this.articleService.articles.subscribe(articles => {
      this.articles = articles;
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.articleService.getArticles().subscribe();
  }

  isArticleAuthor(authorId: string) {
    return this.authService.isTheCurrentUserLogged(authorId);
  }

  // onDelete(id: string) {
  //   this.articleService.deleteArticleComments(id)
  //   .pipe(
  //     switchMap( resData => {
  //       return this.articleService.deleteArticle(id);
  //     })
  //   ).subscribe( () => {
  //     this.appservice.presentToast('המאמר נמחק בהצלחה!', true);
  //   }, error => {
  //     this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
  //   });
  // }

  onDelete(id: string) {
    this.articleService.deleteArticle(id)
    .subscribe( () => {
      this.appservice.presentToast('המאמר נמחק בהצלחה!', true);
    }, error => {
      this.appservice.presentToast('חלה תקלה פעולת המחיקה נכשלה!', false);
    });
  }

  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

}
