import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { Event } from './event.model';
import { EventService } from './event.service';


@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  events: Event[];
  private eventSubscription: Subscription;
  isDesktop: boolean;

  constructor( private eventService: EventService, private appService: AppService) { }

  ngOnInit() {
    this.eventSubscription = this.eventService.events.subscribe(events => {
      this.events = events;
    });
  }

  ionViewWillEnter() {
    this.isDesktop = this.appService.isDesktop();
  }

}
