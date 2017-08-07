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

  mode: string;
  event: CalendarEvent;
  newEvent: CalendarEvent;
  calendars: Observable<Calendar[]>;

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<CalendarDialogComponent>, private calendarService: CalendarService) { }

  ngOnInit() {
    this.mode = this.data.mode;
    this.calendars = this.calendarService.calendars;

    if (this.mode == 'Add') {
      this.event = new CalendarEvent();
      this.event.startDate = this.data.event.startDate;
      this.event.endDate = this.data.event.endDate;
      this.newEvent = new CalendarEvent();
      this.newEvent.startDate = this.data.event.startDate;
      this.newEvent.endDate = this.data.event.endDate;
      this.newEvent.timeZone = this.data.event.timeZone;
    }
    else if (this.mode == 'Edit') {
      console.log('Event',this.data.event);
      this.event = this.data.event;
      this.newEvent = new CalendarEvent(this.data.event);
    }
    else if (this.mode == 'Delete') {
      this.event = this.data.event;
      this.newEvent = new CalendarEvent();
    }
  }

  closeDialog() {
    if (this.mode == 'Delete') {
      this.dialogRef.close([this.mode, this.event, this.newEvent]);
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

    if (isUnmodified) {
      this.dialogRef.close(null);
    } else {
      this.dialogRef.close([this.mode, this.event, this.newEvent]);
    }
  }

  printDate(obj?: any) {
    console.log('Object: ', obj);
  }

}
