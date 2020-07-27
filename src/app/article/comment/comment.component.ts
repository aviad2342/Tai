import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;

  constructor() { }

  ngOnInit() {}

  getAuthorFullName() {
    return this.comment.author.firstName + ' ' + this.comment.author.lastName;
  }
}
