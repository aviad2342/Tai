import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

  getUserFullName() {
    return this.user.firstName + ' ' + this.user.lastName;
  }

}
