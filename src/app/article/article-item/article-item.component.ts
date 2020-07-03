import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article.model';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent implements OnInit {

  @Input() article: Article;

  constructor() { }

  ngOnInit() {}

  getAuthorFullName() {
    return this.article.author.firstName + ' ' + this.article.author.lastName;
  }

}
