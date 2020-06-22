import { Component, OnInit } from '@angular/core';
import { Event } from './event.model';
import { Subscription } from 'rxjs';
import { EventService } from './event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  events: Event[];
  private eventSubscription: Subscription;

  constructor( private eventService: EventService) { }

  ngOnInit() {
    this.eventSubscription = this.eventService.events.subscribe(events => {
      this.events = events;
      console.log(this.events);
    });
  }

}
