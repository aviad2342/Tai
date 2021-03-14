import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from '../app.service';
import { RegistrationService } from '../registration/registration.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  emailIsValid = true;
  retrieveData = false;
  emailErrorLabel = 'כתובת המייל אינה תקינה!';

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
      if (user) {
        this.emailIsValid = false;
        this.emailErrorLabel = 'כתובת המייל קיימת!!';
      } else {
        this.emailIsValid = true;
        this.emailErrorLabel = 'כתובת המייל אינה תקינה!';
      }
    });
  }

  onResetPassword() {}

}
