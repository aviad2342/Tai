import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article.model';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent implements OnInit {

  @Input() article: Article;

  constructor(private userService: UserService) { }

  ngOnInit() {}

}
