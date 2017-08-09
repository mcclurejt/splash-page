import { Observable } from 'rxjs/Observable';
import { CalendarService } from './../../services/calendar.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
import { Calendar } from "app/store/calendar/calendar";
@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})

export class CalendarDialogComponent implements OnInit {

  readonly ADD = 'ADD';
  readonly EDIT = 'EDIT';
  readonly DELETE = 'DELETE';
  readonly CANCEL = 'CANCEL';

  mode: string;
  event: CalendarEvent;
  newEvent: CalendarEvent;
  calendars: Observable<Calendar[]>;
  todaysDate: string;
  startDateEmitter =  new EventEmitter();
  endDateEmitter = new EventEmitter();

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<CalendarDialogComponent>) {
    this._setTodaysDate();
  }

  ngOnInit() {
    this.calendars = this.data.calendars;
    if (this.data.event) {
      this.mode = this.EDIT;
      this.event = this.data.event;
      this.newEvent = new CalendarEvent(this.event);
    } else {
      this.mode = this.ADD;
      this.event = new CalendarEvent();
      this.event.allDayEvent = true;
      this.event.startDate = this.todaysDate;
      this.event.endDate = this.todaysDate;
      this.newEvent = new CalendarEvent(this.event);
    }
    // Convert dates
    this.newEvent = this.convertDates(this.newEvent);
  }

  closeDialog(action: string = this.mode) {
    if (action == this.CANCEL) {
      this.dialogRef.close(null);
      return;
    }
    // If the event is unchanged, pass in null to not update anything
    let isUnmodified = (this.event.allDayEvent == this.newEvent.allDayEvent)
      && (this.event.startDate == this.newEvent.startDate)
      && (this.event.endDate == this.newEvent.endDate)
      && (this.event.startTime == this.newEvent.startTime)
      && (this.event.endTime == this.newEvent.endTime)
      && (this.event.summary == this.newEvent.summary)
      && (this.event.calendarId == this.newEvent.calendarId);

    if (isUnmodified && action != this.DELETE) {
      this.dialogRef.close(null);
      return;
    } else {
      this.newEvent = this.convertDates(this.newEvent);
      this.dialogRef.close([action, this.event, this.newEvent]);
      return;
    }
  }

  startDateChange(startDate: string) {
    // Change the end date if the start date is after it
    let sd = new Date(startDate).getTime();
    let ed = new Date(this.newEvent.endDate).getTime();
    if(sd > ed){
      this.newEvent.endDate = new Date(startDate).toDateString();
    }
  }

  endDateChange(endDate: string) {
    // Change the start date if the end date is before it
    let sd = new Date(this.newEvent.startDate).getTime();
    let ed = new Date(endDate).getTime();
    if(sd > ed){
      this.newEvent.startDate = new Date(endDate).toDateString();
    }
  }

  private convertDates(event: CalendarEvent) {
    if (!event.startDate.toString().includes(' ')) {
      // Normal Date Format -> Google Date Format
      let sd_split = event.startDate.split('-');
      let sd = new Date(parseInt(sd_split[0]),parseInt(sd_split[1]) - 1,parseInt(sd_split[2]));
      event.startDate = sd.toDateString();
      let ed_split = event.endDate.split('-')
      let ed = new Date(parseInt(ed_split[0]),parseInt(ed_split[1]) - 1,parseInt(ed_split[2]));
      event.endDate = ed.toDateString();
    } else {
      // Google Date Format -> Normal Date Format
      let sd = new Date(event.startDate);
      event.startDate = sd.toISOString().split('T')[0];
      let ed = new Date(event.endDate);
      event.endDate = ed.toISOString().split('T')[0];
    }
    return event;
  }

  private _setTodaysDate() {
    let d = new Date();
    let year = String(d.getFullYear());
    let month = String(d.getMonth() + 1);
    month = month.length > 1 ? month : '0' + month;
    let date = String(d.getDate())
    date = date.length > 1 ? date : '0' + date;
    this.todaysDate = year + '-' + month + '-' + date;
  }

}
