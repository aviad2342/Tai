import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';
import { Testimony } from './testimony.model';
import { TestimonyService } from './testimony.service';

@Component({
  selector: 'app-testimony',
  templateUrl: './testimony.page.html',
  styleUrls: ['./testimony.page.scss'],
})
export class TestimonyPage implements OnInit, OnDestroy {

  testimonies: Testimony[];
  private testimoniesSubscription: Subscription;
  isDesktop: boolean;

  constructor(
    private testimonyService: TestimonyService,
    private appService: AppService,
    private authService: AuthService
     ) { }

  ngOnInit() {
    this.testimoniesSubscription = this.testimonyService.testimonies.subscribe(testimonies => {
      this.testimonies = testimonies.filter(t => t.approved);
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    this.testimonyService.getTestimonies().subscribe();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.authService.getUserLogged().subscribe(user => {
      const testimony = new Testimony(
        null,
        user.firstName,
        user.lastName,
        new Date(),
        form.value.body,
        user.profilePicture,
        false
      );
      this.testimonyService.addTestimony(testimony).subscribe(newTestimony => {
        this.appService.presentToast('תודה! עדותך נשלחה לאישור.', true);
        form.reset();
      }, error => {
        form.reset();
        this.appService.presentToast('חלה תקלה עדותך לא נשמרה', false);
      });
    });
  }

  ngOnDestroy() {
    if (this.testimoniesSubscription) {
      this.testimoniesSubscription.unsubscribe();
    }
  }

}
