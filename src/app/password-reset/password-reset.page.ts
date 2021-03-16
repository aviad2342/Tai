import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonIcon, IonInput, NavController, Platform } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { PasswordReset } from '../user/password-reset.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  passwordReset: PasswordReset;
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
      this.userService.getPasswordReset(paramMap.get('email')).pipe(
        switchMap(passwordReset => {
          this.passwordReset = passwordReset;
          if (passwordReset.expirationDate > new Date()) {
            this.isLoading = false;
            this.resetSuccess = false;
            this.resetMassage = 'פג התוקף של קישור זה! יש לשלוח בקשה חוזרת לאיפוס הסיסמה.';
          }
          return this.userService.getUserByEmail(passwordReset.email);
        })).subscribe(user => {
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
    this.userService.updateUserPassword(this.user, this.passwordReset.token).subscribe( passwordReset => {
      if (passwordReset.success) {
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
