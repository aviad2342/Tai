import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { User } from './user.model';



@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, OnDestroy {

  users: User[];
  private starsSub: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.starsSub = this.userService.users.subscribe(users => {
      this.users = users;
    });
  }

  ionViewWillEnter() {
    this.userService.getUsers().subscribe();
  }

  ngOnDestroy() {
    if (this.starsSub) {
      this.starsSub.unsubscribe();
    }
  }

}
