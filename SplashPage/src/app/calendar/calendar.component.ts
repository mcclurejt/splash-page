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

  constructor(private gapiService: GapiService) {
    this.gapiService.isSignedInStream.subscribe((isLoaded) => {
      console.log('Check loaded');
      if (isLoaded) {
        console.log('Gapi Loaded');
        this.loadCal();
      };
    });
  }

  loadCal(){
    this.calendarEventList = this.gapiService.getCalendars()
      .map((response) => {return response.result.items})
      .flatMap((calList) => this.gapiService.getEvents(calList))
      .map((calArray) => {
        return this.gapiService.mapEvents(calArray);
      })
      // .map((calArray) => this.gapiService.mapEvents(calArray))
      // .subscribe( (calendarEventList: CalendarEvent[] ) => {
      //   this.calendarEventList = calendarEventList;
      //   return calendarEventList;
      // });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

}
