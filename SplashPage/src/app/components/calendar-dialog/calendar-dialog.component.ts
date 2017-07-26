import { CalendarService } from './../../services/calendar.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { CalendarEvent } from './../../models/calendar-event';
import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
import { Calendar } from "app/models/calendar";
@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})
export class CalendarDialogComponent {

  mode: string;
  event: CalendarEvent;
  newEvent: CalendarEvent;
  calendars: Calendar[];

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<CalendarDialogComponent>) {
    this.mode = data.mode;
    if(this.mode == 'Add'){
      this.event = new CalendarEvent();
      this.event.startDate = data.event.startDate;
      this.event.endDate = data.event.endDate;
      this.newEvent = new CalendarEvent();
      this.newEvent.startDate = data.event.startDate;
      this.newEvent.endDate = data.event.endDate;
      this.calendars = data.calendars;
    } else if(this.mode == 'Edit'){
      this.event = data.event;
      this.newEvent = new CalendarEvent(data.event);
      this.calendars = data.calendars;
    } else if(this.mode == 'Delete'){
      this.event = data.event;
      this.calendars = data.calendars;
    }
  }

  closeDialog() {
    if(this.mode == 'Delete'){
      this.dialogRef.close([this.mode,this.event]);
      return;
    }
    // If the event is unchanged, pass in null to not update anything
    let isUnmodified = (this.event.allDayEvent == this.newEvent.allDayEvent)
    && (this.event.startDate == this.newEvent.startDate)
    && (this.event.endDate == this.newEvent.endDate)
    && (this.event.startTime == this.newEvent.startTime)
    && (this.event.endTime == this.newEvent.endTime)
    && (this.event.summary == this.newEvent.summary);
      
    if(isUnmodified){
      this.dialogRef.close(null);
    } else {
      this.dialogRef.close([this.mode,this.newEvent]);
    }
  }

}
