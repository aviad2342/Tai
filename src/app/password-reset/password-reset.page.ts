import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonIcon, IonInput, NavController, Platform } from '@ionic/angular';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  user: User;
  isLoading = false;
  userOldPassword = '';
  moveToAuthPageRef = '';
  resetSuccess = false;
  resetMassage = '';

  constructor(
    private router: Router,
    private navController: NavController,
    private route: ActivatedRoute,
    private userService: UserService,
    private platform: Platform,
    ) { }

  ngOnInit() {
    if(this.platform.is('mobile')) {
      this.moveToAuthPageRef = 'intent://scan/#Intent;scheme=com.tai.wos;package=com.tai.wos;end';
    } else {
      this.moveToAuthPageRef = '/auth';
    }
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('email')) {
        this.navController.navigateRoot('/auth');
        return;
      }
      this.userService.getUserByEmail(paramMap.get('email')).subscribe(user => {
        this.user = user;
        this.userOldPassword = user.password;
      },
        error => {
          this.isLoading = false;
          this.resetSuccess = false;
          this.resetMassage = 'ישנה תקלה! אנא נסה מאוחר יותר.';
        }
      );
    });
  }

  togglePasswordVisibility(input: IonInput, icon: IonIcon) {
    if(input.type === 'password') {
      input.type = 'text';
      icon.name = 'eye-outline';
    } else {
      input.type = 'password';
      icon.name = 'eye-off-outline';
    }
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.user.password = form.value.password;
    this.userService.updateUser(this.user).subscribe( user => {
      if (user.password !== this.userOldPassword) {
        this.resetSuccess = true;
        this.resetMassage = 'הסיסמה שונתה בהצלחה!';
      }
    }, error => {
      this.resetSuccess = false;
      this.resetMassage = 'ישנה תקלה! אנא נסה שנית מאוחר יותר.';
    }
    );
  }

  async onMoveToAuthPage() {
    if(this.platform.is('mobile')) {
        // this.navController.navigateRoot('intent://scan/#Intent;scheme=com.tai.wos;package=com.tai.wos;end');
    } else {
      this.navController.navigateRoot('/auth');
    }
  }
}
