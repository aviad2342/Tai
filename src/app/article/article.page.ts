import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit, OnDestroy {

  articles: Article[];
  private articleSubscription: Subscription;
  isDesktop: boolean;

  constructor( private articleService: ArticleService, private appService: AppService, private authService: AuthService ) { }

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

  onDelete(id: string) {
    this.articleService.deleteArticle(id).subscribe(() => {
    });
  }

  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

}
