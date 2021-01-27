import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, IonInput, IonIcon } from '@ionic/angular';
import { AuthService } from './auth.service';
import { NgForm, NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserLogged } from './userLogged.model';
import { UserService } from '../user/user.service';
import { AppService } from '../app.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  userProfilePicture = `http://${environment.LOCALHOST}:3000/images/user-default-image.png`;
  homePage = '/tabs/user'

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private appService: AppService,
    private userService: UserService
  ) {}

  ngOnInit() {
    console.log(new Date());
    if(this.appService.isDesktop()) {
      this.homePage = '/user';
    }
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
            this.router.navigateByUrl(this.homePage);
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

  togglePasswordVisibility(input: IonInput, icon: IonIcon) {
    if(input.type === 'password') {
      input.type = 'text';
      icon.name = 'eye-outline';
    } else {
      input.type = 'password';
      icon.name = 'eye-off-outline'
    }
  }

  getUserProfilePicture(emailCtrl: NgControl) {
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
