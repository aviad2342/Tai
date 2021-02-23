import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthResponseData, RegistrationService } from '../registration/registration.service';

// export interface AuthResponseData {
//   id: string;
//   firstName: string;
//   lastName: string;
//   verified: boolean;
//   alreadyVerified: boolean;
//   userSaved: boolean;
//   UpdateRegisteredUser: boolean;
//   notRegistered: boolean;
// }

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

  constructor(
    private router: Router,
    private navController: NavController,
    private route: ActivatedRoute,
    private registrationService: RegistrationService
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('token')) {
        this.navController.navigateBack('/tabs/article');
        return;
      }
      this.registrationService.verifyRegisteredUser(paramMap.get('token')).subscribe(responseData => {
        this.authResponseData = responseData;
        console.log(responseData);
        // todo verify
        this.isLoading = false;
      },
        error => {
          this.verificationSuccess = false
          this.verificationMassage = 'ישנה תקלה! אנא נסה מאוחר יותר.'
        }
      );
    });
  }

}
