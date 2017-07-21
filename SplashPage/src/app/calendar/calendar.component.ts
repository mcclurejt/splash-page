import { GoogleCalendarService } from './../google/google-calendar.service';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from './../models/calendar-event';
import { GapiService } from './../google/gapi.service';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent{

  eventStream: Observable<CalendarEvent[]>;
  allDayEventStream: Observable<CalendarEvent[]>;
  eventMap: Map<string, CalendarEvent[]> = new Map< string, CalendarEvent[]>();
  tempDate: string = null;

  constructor(private gapiService: GapiService, public googleCalendarService: GoogleCalendarService) {
    this.assignEventStream();
  }

  assignEventStream() {
    this.eventStream = this.googleCalendarService.allEventStream;
  }

  onClick(id: string){
    console.log('Item with id:',id);
  }

}

