import { Observable } from 'rxjs/Observable';
import { CalendarService } from './../../services/calendar.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Component, Inject, OnInit } from '@angular/core';
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

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<CalendarDialogComponent>) {
    this._setTodaysDate();
  }

  ngOnInit() {
    this.calendars = this.data.calendars;
    if (this.data.event) {
      this.event = this.data.event;
      this.newEvent = new CalendarEvent(this.event);
      this.mode = this.EDIT;
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
    console.log('Action: ', action);
    if (action == this.CANCEL) {
      this.dialogRef.close(null);
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
    } else {
      this.newEvent = this.convertDates(this.newEvent);
      this.dialogRef.close([action, this.event, this.newEvent]);
    }
  }

  private convertDates(event: CalendarEvent) {
    console.log('StartDate', event.startDate);
    console.log('EndDate', event.endDate);
    if (!event.startDate.toString().includes(' ')) {
      // Normal Date Format -> Google Date Format
      console.log('StartDate', event.startDate);
      console.log('EndDate', event.endDate);
      let sd = new Date(event.startDate);
      sd.setDate(sd.getDate() + 1);
      event.startDate = sd.toDateString();
      let ed = new Date(event.endDate);
      ed.setDate(ed.getDate() + 1);
      event.endDate = ed.toDateString();
      console.log('StartDate', event.startDate);
      console.log('EndDate', event.endDate);
    } else {
      // Google Date Format -> Normal Date Format
      let sd = new Date(event.startDate);
      event.startDate = sd.getFullYear() + '-' + (sd.getMonth() + 1) + '-' + sd.getDate();
      let ed = new Date(event.endDate);
      event.endDate = ed.getFullYear() + '-' + (ed.getMonth() + 1) + '-' + ed.getDate();
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
