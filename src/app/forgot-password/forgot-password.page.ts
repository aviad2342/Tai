import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { RegistrationService } from '../registration/registration.service';
import { PasswordReset } from '../user/password-reset.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  userEmail = '';
  passwordReset: PasswordReset;
  user: User
  emailIsValid = true;
  retrieveData = false;
  emailErrorLabel = 'כתובת המייל אינה תקינה!';
  didReset = false;
  resetSuccess = false;
  resetMassage = '';

  constructor(
    private navController: NavController,
    private registrationService: RegistrationService,
    private userSrvice: UserService,
    public appService: AppService
    ) { }

  ngOnInit() {
  }

  onFocusEmail() {
    this.emailIsValid = true;
    this.emailErrorLabel = 'כתובת המייל אינה תקינה!';
  }

  onResetPassword() {
    this.retrieveData = true;
    this.userSrvice.getUserByEmail(this.userEmail).pipe(
      switchMap(user => {
        if (!user) {
          this.emailIsValid = false;
          this.emailErrorLabel = 'כתובת המייל אינה קיימת!';
          return throwError(new Error(this.emailErrorLabel));
        }
        const date: Date = new Date();
        const passwordReset = new PasswordReset(
        null,
        user.firstName,
        user.lastName,
        user.email,
        new Date(),
        new Date(date.setDate(date.getDate() + 3)),
        false,
        false,
        false
    );
      return this.registrationService.resetUserPassword(passwordReset);
      })
    ).subscribe(resData => {
      if(resData && resData.emailSent) {
        this.resetMassage = 'הפעולה הצליחה! קישור לאיפוס הסיסמה נשלח לתיבת המייל שלך.'
        this.resetSuccess = true;
        // this.appService.presentToast('העדות נשמרה בהצלחה', true);
        // this.navController.navigateBack('/manage/testimonies');
      } else {
        this.resetMassage = 'הפעולה נכשלה! אנא נסה שנית מאוחר יותר.';
        this.resetSuccess = false;
      }
      this.didReset = true;
    }, error => {
        this.resetMassage = error.message;
        this.resetSuccess = false;
        this.retrieveData = false;
    });

    setTimeout(() => {
      this.retrieveData = false;
    }, 3000);
  }

}
