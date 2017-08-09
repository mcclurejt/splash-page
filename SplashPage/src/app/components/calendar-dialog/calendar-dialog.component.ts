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
  todaysDate: Date;
  startDate: Date;
  endDate: Date;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<CalendarDialogComponent>) {
    this._setTodaysDate();
  }

  ngOnInit() {
    this.calendars = this.data.calendars;
    if (this.data.event) {
      this.mode = this.EDIT;
      this.event = this.data.event;
      this.newEvent = new CalendarEvent(this.event);
      let sd_split = this.newEvent.startDate.split('-');
      let startTime = this.newEvent.startTime.split(':');
      this.startDate = new Date(parseInt(sd_split[0]), parseInt(sd_split[1]) - 1, parseInt(sd_split[2]), parseInt(startTime[0]), parseInt(startTime[1]));
      let ed_split = this.newEvent.endDate.split('-');
      let endTime = this.newEvent.endTime.split(':');
      this.endDate = new Date(parseInt(ed_split[0]), parseInt(ed_split[1]) - 1, parseInt(ed_split[2]), parseInt(endTime[0]), parseInt(endTime[1]));
    } else {
      this.mode = this.ADD;
      this.event = new CalendarEvent();
      this.newEvent = new CalendarEvent();
      this.newEvent.allDayEvent = true;
      this.startDate = this.todaysDate;
      this.endDate = this.todaysDate;
    }
  }

  closeDialog(action: string = this.mode) {
    if (action == this.CANCEL) {
      this.dialogRef.close(null);
      return;
    }
    this.newEvent = this.convertDates(this.newEvent);
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
      this.dialogRef.close([action, this.event, this.newEvent]);
      return;
    }
  }

  startDateChange(startDate: string) {
    // Change the end date if the start date is after it
    let sd = new Date(startDate).getTime();
    let ed = new Date(this.endDate).getTime();
    if (sd > ed) {
      this.endDate = new Date(startDate);
    }
  }

  endDateChange(endDate: string) {
    // Change the start date if the end date is before it
    let sd = this.startDate.getTime();
    let ed = new Date(endDate).getTime();
    if (sd > ed) {
      this.startDate = new Date(endDate);
    }
  }

  private convertDates(event: CalendarEvent) {
    // Convert from Date obj format to the one I use
    event.startDate = this.startDate.toISOString().split('T')[0];
    event.startTime = this.startDate.toTimeString().split(' ')[0].substr(0, 5);
    event.endDate = this.endDate.toISOString().split('T')[0];
    event.endTime = this.endDate.toTimeString().split(' ')[0].substr(0, 5);
    return event;
  }

  private _setTodaysDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let date = d.getDate();
    this.todaysDate = new Date(year,month,date)
  }

}
