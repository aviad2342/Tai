import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { AuthResponseData, RegistrationService } from '../registration/registration.service';


@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  authResponseData: AuthResponseData;
  isLoading = false;
  verificationSuccess = false;
  verificationMassage = '';
  moveToAuthPageRef = '';

  constructor(
    private router: Router,
    private navController: NavController,
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
    private platform: Platform,
    ) { }

  ngOnInit() {
    if(this.platform.is('mobile')) {
      this.moveToAuthPageRef = 'intent://scan/#Intent;scheme=com.tai.wos;package=com.tai.wos;end';
    } else {
      this.moveToAuthPageRef = '/auth';
    }
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('token')) {
        this.navController.navigateRoot('/auth');
        return;
      }
      this.registrationService.verifyRegisteredUser(paramMap.get('token')).subscribe(responseData => {
        this.authResponseData = responseData;
        this.verificationSuccess = responseData.success;
        this.isLoading = false;
        if(responseData.success && responseData.verified) {
          this.verificationMassage = 'הידד ' + responseData.firstName + ', חשבונך הופעל בהצלחה.'
        } else {
          if(responseData.alreadyVerified && responseData.verified) {
            this.verificationMassage = 'חשבון זה הופעל כבר!';
        } else if (!responseData.userSaved || responseData.notRegistered || !responseData.UpdateRegisteredUser) {
            this.verificationMassage = 'ישנה תקלה אנא צור עימנו קשר בטלפון: 052-5371804 או בכתובת המייל: subconsciou.Service@gmail.com';
          }
        }
      },
        error => {
          this.isLoading = false;
          this.verificationSuccess = false
          this.verificationMassage = 'ישנה תקלה! אנא נסה מאוחר יותר.'
        }
      );
    });
  }

  async onMoveToAuthPage() {
    if(this.platform.is('mobile')) {
        // this.navController.navigateRoot('intent://scan/#Intent;scheme=com.tai.wos;package=com.tai.wos;end');
    } else {
      this.navController.navigateRoot('/auth');
    }
  }

}
