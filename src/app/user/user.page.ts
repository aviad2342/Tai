import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user.model';
import { IonItemSliding } from '@ionic/angular';




@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit, OnDestroy {

  users: User[];
  private starsSub: Subscription;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.starsSub = this.userService.users.subscribe(users => {
      this.users = users;
    });
  }

  ionViewWillEnter() {
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
    if (this.starsSub) {
      this.starsSub.unsubscribe();
    }
  }

}
