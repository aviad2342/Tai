import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.model';

@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.page.html',
  styleUrls: ['./menu-tab.page.scss'],
})
export class MenuTabPage implements OnInit {

  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserLogged().subscribe(user => {
      this.user = user;
    });
  }

}
