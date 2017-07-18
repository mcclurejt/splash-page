import { GapiService } from './../services/gapi.service';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  eventArray = [];

  constructor(private gapiService: GapiService) {
    this.gapiService.isSignedInStream.subscribe((isLoaded) => {
      console.log('Check loaded');
      if (isLoaded) {
        console.log('Gapi Loaded');
        this.loadCalendarFromGoogle();
      };
    });
  }

  loadCalendarFromGoogle() {
    this.gapiService.loadCalendars().then((events) => {
      this.sortEvents(events);
    });
  }

  sortEvents(events) {
    for (let event of events) {
      for (let item of event.items) {
        console.log('event', event);
        if (item) {
          this.eventArray.push(item)
        }
      }
    }
    console.log('eventArray', this.eventArray);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

}
