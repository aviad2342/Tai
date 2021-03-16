import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  userEmail: string;
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

  onVerifyEmail(event) {
    this.userSrvice.getUserByEmail(event.target.value).subscribe( user => {
      if (!user) {
        this.emailIsValid = false;
        this.emailErrorLabel = 'כתובת המייל אינה קיימת!!';
      } else {
        this.user = user;
        this.emailIsValid = true;
        this.emailErrorLabel = 'כתובת המייל אינה תקינה!';
      }
    });
  }

  onResetPassword() {
    this.retrieveData = true;
    const date: Date = new Date();
    const passwordReset = new PasswordReset(
      null,
      this.user.firstName,
      this.user.lastName,
      this.user.email,
      new Date(),
      new Date(date.setDate(date.getDate() + 3)),
      false,
      false
    );
    this.registrationService.resetUserPassword(passwordReset).subscribe(resData => {
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
        this.resetMassage = 'הפעולה נכשלה! אנא נסה שנית מאוחר יותר.';
        this.resetSuccess = false;
        this.retrieveData = false;
    });

    setTimeout(() => {
      this.retrieveData = false;
    }, 3000);
  }

}
