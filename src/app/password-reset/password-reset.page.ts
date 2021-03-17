import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonIcon, IonInput, NavController, Platform } from '@ionic/angular';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';
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
  isDone = false;
  linkExpired: boolean;
  userOldPassword = '';
  moveToAuthPageRef = '';
  resetMassage = '';

  constructor(
    private router: Router,
    public appService: AppService,
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
          if (!passwordReset) {
            this.linkExpired = true;
            this.resetMassage = 'ישנה תקלה! אנא נסה מאוחר יותר.';
            this.isDone = true;
            return throwError(new Error(this.resetMassage));
          }

          if (passwordReset.activated) {
            this.linkExpired = true;
            this.resetMassage = 'קישור זה היה בשימוש בעבר! יש לשלוח בקשה חוזרת לאיפוס הסיסמה.';
            this.isDone = true;
            return throwError(new Error(this.resetMassage));
          }

          this.passwordReset = passwordReset;
          const now = Date.parse(new Date().toISOString());
          const expirationDate = Date.parse(passwordReset.expirationDate.toString());
          if (expirationDate < now) {
            this.linkExpired = true;
            this.resetMassage = 'פג התוקף של קישור זה! יש לשלוח בקשה חוזרת לאיפוס הסיסמה.';
            this.isDone = true;
            return throwError(new Error(this.resetMassage));
          }
          return this.userService.getUserByEmail(passwordReset.email);
        })).subscribe(user => {
        this.user = user;
        this.userOldPassword = user.password;
      },
        error => {
          this.linkExpired = true;
          this.resetMassage = error.message;
          this.isDone = true;
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
        this.appService.presentToast('העדות נשמרה בהצלחה', true);
        this.isDone = true;
      } else {
        this.linkExpired = true;
        this.resetMassage = 'ישנה תקלה! הסיסמה לא שונתה..';
        this.isDone = true;
      }
    }, error => {
      this.linkExpired = true;
      this.resetMassage = 'ישנה תקלה! אנא נסה שנית מאוחר יותר.';
      this.isDone = true;
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
