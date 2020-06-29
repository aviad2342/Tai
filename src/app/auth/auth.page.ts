import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { NgForm, NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserLogged } from './userLogged.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  userProfilePicture = 'http://localhost:3000/images/user-default-image.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private userService: UserService
  ) {}

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingController
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.login(email, password).subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            // this.router.navigateByUrl('/places/tabs/discover');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error;
            let message = 'ההתחברות נכשלה! נסה שנית.';
            if (code === 'EMAIL_NOT_FOUND') {
              message = 'כתובת המייל אינה קיימת!';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'הסיסמה איתה תואמת לכתובת המייל!';
            }
            this.showAlert(message);
          }
        );
      });
  }

  getUserProfilePicture(emailCtrl: NgControl) {
    this.authService.autoLogin().subscribe();
    if ( emailCtrl.touched && emailCtrl.valid ) {
      this.userService.getUserByEmail(emailCtrl.value).subscribe(user => {
        if (user) {
          this.userProfilePicture = user.profilePicture;
        }
      });
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertController
      .create({
        header: 'ההתחברות נכשלה',
        message,
        buttons: ['נסה שנית']
      })
      .then(alertEl => alertEl.present());
  }

}
