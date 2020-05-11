import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit {

  @Input() user: User;

  image = 'https://scontent.fsdv2-1.fna.fbcdn.net/v/t1.0-1/p160x160/10600649_10152646233963389_887571430359705805_n.jpg?_nc_cat=111&_nc_sid=dbb9e7&_nc_oc=AQm7vaRHs9d86SYPun596Z41tnuC3tPcu0NDjZYgKBSZxPm90xqwRlJfXFhaxPUyrLg&_nc_ht=scontent.fsdv2-1.fna&_nc_tp=6&oh=1e604912d9fb58d74b6e9cb44684cae2&oe=5EDF347C';

  constructor() { }

  ngOnInit() {}

  getUserFullName() {
    return this.user.firstName + ' ' + this.user.lastName;
  }

}
