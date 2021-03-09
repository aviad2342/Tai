import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
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

  constructor( private testimonyService: TestimonyService, private appService: AppService ) { }

  ngOnInit() {
    this.testimoniesSubscription = this.testimonyService.getAllTestimonies().subscribe(testimonies => {
      this.testimonies = testimonies;
    });
    // this.testimoniesSubscription = this.testimonyService.testimonies.subscribe(testimonies => {
    //   this.testimonies = testimonies;
    // });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
    // this.testimonyService.getTestimonies().subscribe();
  }

  ngOnDestroy() {
    if (this.testimoniesSubscription) {
      this.testimoniesSubscription.unsubscribe();
    }
  }

}
