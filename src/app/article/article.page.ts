import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from './article.model';
import { ArticleService } from './article.service';
import { AppService } from '../app.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit, OnDestroy {

  articles: Article[];
  private articleSubscription: Subscription;
  isDesktop: boolean;

  constructor( private articleService: ArticleService, private appService: AppService ) { }

  ngOnInit() {
    this.articleSubscription = this.articleService.articles.subscribe(articles => {
      this.articles = articles;
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
  }

  ngOnDestroy() {
    if (this.articleSubscription) {
      this.articleSubscription.unsubscribe();
    }
  }

}
