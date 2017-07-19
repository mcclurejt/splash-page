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

  eventListStream: Observable<CalendarEvent[]>;
  allDayEventListStream: Observable<CalendarEvent[]>;
  calendarEventList: CalendarEvent[] = [];
  allDayEventList: CalendarEvent[] = [];
  columns = { name: 'summary' };


  constructor(private gapiService: GapiService, private googleCalendarService: GoogleCalendarService) {
    this.loadEvents();
  }

  loadEvents() {
    this.gapiService.getIsSignedInStream().subscribe((isLoaded) => {
      if (isLoaded) {
        this.assignEventStreams();
      };
    });
  }

  assignEventStreams(){
    this.eventListStream = this.googleCalendarService.getEvents();
    this.allDayEventListStream = this.eventListStream
      .map( (eventList: CalendarEvent[]) => {
        let allDayEvents = [];
        for(let event of eventList){
          if(event.allDayEvent){
            allDayEvents.push(event);
          }
        }
        return allDayEvents;
      })
  }

  getAllDayEventStream(){
    return this.eventListStream.map((eventList: CalendarEvent[]) => {
        let allDayEvents = [];
        for(let event of eventList){
          if(event.allDayEvent){
            allDayEvents.push(event);
          }
        }
        return allDayEvents;
      }).share();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    
  }

}
