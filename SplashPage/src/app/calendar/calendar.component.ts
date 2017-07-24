import { CalendarService } from './../services/calendar.service';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';
import { GoogleCalendarService } from './../google/google-calendar.service';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from './../models/calendar-event';
import { GapiService } from './../google/gapi.service';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  eventStream: Observable<CalendarEvent[]>;
  todaysDate: string;
  isScrollLoading: boolean = false;

  constructor(public calendarService: CalendarService) {
    this.eventStream = calendarService.eventStream;
    this.todaysDate = calendarService.todaysDate;
  }

  onScrollDown() {
    console.log('Scrolled Down');
    this.isScrollLoading = true;
  }
  
  openDialog(mode:string, event:CalendarEvent){
   this.calendarService.openDialog(mode, event);
  }
}



