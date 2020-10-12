import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../comment.model';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;
  author: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUser(this.comment.authorId).subscribe(user => {
      this.author = user;
    });
  }

}
