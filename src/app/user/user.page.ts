import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user.model';
import { IonItemSliding } from '@ionic/angular';
import { AppService } from '../app.service';




@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, OnDestroy {

  users: User[];
  private usersSubscription: Subscription;
  isDesktop: boolean;

  constructor(private userService: UserService, private router: Router, private appService: AppService) { }

  ngOnInit() {
    this.usersSubscription = this.userService.users.subscribe(users => {
      this.users = users;
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.userService.getUsers().subscribe();
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['tabs', 'user', 'edit', id]);
    console.log('Editing item', id);
  }

  onDelete(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.userService.deleteUser(id).subscribe(() => {
    });
  }

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

}
