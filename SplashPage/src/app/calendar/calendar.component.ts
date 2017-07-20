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

  allEventStream: Observable<CalendarEvent[]>;
  allDayEventStream: Observable<CalendarEvent[]>;
  eventMap: Map<string, CalendarEvent[]> = new Map< string, CalendarEvent[]>();

  constructor(private gapiService: GapiService, private googleCalendarService: GoogleCalendarService) {
    this.assignEvents();
  }

  ngOnInit(): void {

  }

  assignEvents() {
    // this.googleCalendarService.allEventStream.subscribe((events: CalendarEvent[]) => {
    //   // Assign filtered events to their respective lists
    //   this.eventMap['all'] = events;
    //   this.eventMap['allDay'] = this.filterAllDayEvents(events);

    // });
  }

  filterAllDayEvents(events: CalendarEvent[]) {
    let allDayEvents = [];
    for (let event of events) {
      if (event.allDayEvent) {
        allDayEvents.push(event);
      }
    }
    let eventsByDay = this.getEventsByDay(allDayEvents);
    console.log('Events By Day', eventsByDay);
    return eventsByDay;
  }

  getEventsByDay(events: CalendarEvent[]){
    let eventsByDay = [ [], [], [], [], [], [], [] ];
    let refDate = this.getFirstDayOfWeek();
    let oneDay = 24*60*60*1000;
    for(let event of events){
      let dateArray = event.startDate.split('-');
      let eventDate = new Date(event.startDate);
      let idx = Math.round(Math.abs((eventDate.getTime() - refDate.getTime())/oneDay));
      if(idx < 7){
        eventsByDay[idx].push(event);
      }
    }
    return eventsByDay;
  }


  /**
   * Returns the Date object representing the first day of the week
   */
  private getFirstDayOfWeek(): Date {
    let d = new Date();
    d = new Date(d.getFullYear(),d.getMonth(),d.getDate())
    let day = d.getDay();
    let diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  ngOnDestroy(): void {

  }

}
