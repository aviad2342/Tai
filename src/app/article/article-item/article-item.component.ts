import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article.model';
import { UserService } from 'src/app/user/user.service';
import { User } from 'src/app/user/user.model';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent implements OnInit {

  @Input() article: Article;
  author: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser(this.article.authorId).subscribe(user => {
      this.author = user;
    });
  }

  getAuthorFullName() {
    return this.author?.firstName + ' ' + this.author?.lastName;
  }

}
