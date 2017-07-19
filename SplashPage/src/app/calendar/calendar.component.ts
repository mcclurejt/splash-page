import { GoogleCalendarService } from './../google/google-calendar.service';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from './../models/calendar-event';
import { GapiService } from './../google/gapi.service';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  calendarEventList: Observable<CalendarEvent[]>

  constructor(private gapiService: GapiService, private googleCalendarService: GoogleCalendarService) {
    this.gapiService.getIsSignedInStream().subscribe((isLoaded) => {
      if (isLoaded) {
        this.loadGoogleCalendar();
      };
    });
  }

  loadGoogleCalendar(){
    this.calendarEventList = this.googleCalendarService.getCalendars()
      .map((response) => {return response.result.items})
      .flatMap((calList) => this.googleCalendarService.getEvents(calList))
      .map((calArray) => {
        return this.googleCalendarService.mapEvents(calArray);
      });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

}
