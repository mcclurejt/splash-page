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
  styleUrls: ['./calendar.component.scss'],
})

export class CalendarComponent{

  eventStream: Observable<CalendarEvent[]>;
  todaysDate: string;
  isScrollLoading: boolean = false;

  constructor(private gapiService: GapiService, public googleCalendarService: GoogleCalendarService) {
    this.assignEventStream();
    this.setTodaysDate();
  }

  setTodaysDate(){
    let d = new Date();
    let year = String(d.getFullYear());
    let month = String(d.getMonth() + 1);
    month = month.length > 1 ? month : '0' + month;
    let date = String(d.getDate())
    date = date.length > 1 ? date : '0' + date;
    this.todaysDate =  year + '-' + month + '-' + date;
    console.log(this.todaysDate);
  }

  assignEventStream() {
    this.eventStream = this.googleCalendarService.eventStream;
  }

  onScrollDown(){
    console.log('Scrolled Down');
    this.isScrollLoading = true;
  }

  handleAddEvent(date: string){
    console.log('handleAddEvent()');
    let event = new CalendarEvent();
    this.googleCalendarService.addEvent(event);
  }

}

