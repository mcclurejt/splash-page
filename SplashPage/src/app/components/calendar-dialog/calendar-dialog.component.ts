import { Observable } from 'rxjs/Observable';
import { CalendarService } from './../../services/calendar.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { Calendar } from "app/store/calendar/calendar";
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';

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
  todaysDate: Date;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CalendarDialogComponent>, public snackBar: MatSnackBar) {
    this._setTodaysDate();
  }

  ngOnInit() {
    this.calendars = this.data.calendars;
    if (this.data.event) {
      if(this.data.event.calendarId == ''){
        this.mode = this.ADD;
      } else {
        this.mode = this.EDIT;
      }
      this.event = this.data.event;
      this.newEvent = new CalendarEvent(this.event);
    } else {
      this.mode = this.ADD;
      this.event = new CalendarEvent();
      this.newEvent = new CalendarEvent();
      this.newEvent.allDayEvent = true;
    }
  }

  closeDialog(action: string = this.mode) {
    if (action == this.CANCEL) {
      this.dialogRef.close(null);
      return;
    }
    // If the event is unchanged, pass in null to not update anything
    let isUnmodified = (this.event.allDayEvent == this.newEvent.allDayEvent)
      && (this.event.startDate.getTime() == this.newEvent.startDate.getTime())
      && (this.event.endDate.getTime() == this.newEvent.endDate.getTime())
      && (this.event.summary == this.newEvent.summary)
      && (this.event.calendarId == this.newEvent.calendarId);

    if (isUnmodified && action != this.DELETE) {
      this.dialogRef.close(null);
      return;
    } else {
      console.log('Action',action);
      this.openSnackBar(action);
      this.dialogRef.close([action, this.event, this.newEvent]);
      return;
    }
  }

  startDateChange(startDate: string) {
    // Change the end date if the start date is after it
    let sd = new Date(startDate).getTime();
    let ed = this.newEvent.endDate.getTime();
    if (sd > ed) {
      this.newEvent.endDate = new Date(startDate);
    }
  }

  endDateChange(endDate: string) {
    // Change the start date if the end date is before it
    let sd = this.newEvent.startDate.getTime();
    let ed = new Date(endDate).getTime();
    if (sd > ed) {
      this.newEvent.startDate = new Date(endDate);
    }
  }

  startTimeChange(startTime: any) {
    let st = new Date(startTime).getTime();
    let et = this.newEvent.endDate.getTime();
    if (st > et) {
      this.newEvent.endDate = new Date(startTime);
    }
  }

  endTimeChange(endTime: any) {
    let st = this.newEvent.startDate.getTime();
    let et = new Date(endTime).getTime();
    if (st > et) {
      this.newEvent.startDate = new Date(endTime);
    }
  }

  private openSnackBar(mode){
    let message;
    let action = 'Close';
    if(mode == this.ADD){
      message = 'Event Added';
    } else if(mode == this.EDIT){
      message = 'Event Edited';
    } else if(mode == this.DELETE){
      message = 'Event Deleted'
    } else {
      return;
    }
    this.snackBar.open(message,action,{duration: 2000,});
  }

  private _setTodaysDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let date = d.getDate();
    this.todaysDate = new Date(year, month, date)
  }

}
