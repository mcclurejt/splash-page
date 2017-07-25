import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Injectable } from '@angular/core';
import { GcalService } from "app/content-providers/google/gcal.service";
import { CalendarEvent } from "app/models/calendar-event";
import { CalendarDialogComponent } from "app/components/calendar-dialog/calendar-dialog.component";
import { Calendar } from "app/models/calendar";

@Injectable()
export class CalendarService {

  public eventStream: Observable<CalendarEvent[]>;
  public calendars: Calendar[];
  public todaysDate: string;

  constructor(public gcalService: GcalService, public dialog: MdDialog) {
    this._buildEventStream();
    this._setTodaysDate();
  }

  openDialog(mode: string, event: CalendarEvent) {
    let height;
    let width;
    switch(mode){
      case('Add'):{
        height = '550px';
        width = '400px';
        break;
      }
      case('Edit'):{
        height = '525px';
        width = '400px';
        break;
      }
      case('Delete'):{
        height = '170px';
        width = '400px';
        break;
      }
    }

    let dialogRef = this.dialog.open(CalendarDialogComponent, {
      data: {
        mode: mode,
        event: event,
        calendars: this.calendars,
      },
      height: height,
      width: width,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) {
        console.log('Dialog closed, no changes made.', result);
        return;
      }
      let mode = result[0];
      let event = result[1];
      if (mode == 'Add') {
        this.addEvent(event);
      } else if (mode == 'Edit') {
        this.editEvent(event);
      } else if (mode == 'Delete') {
        this.deleteEvent(event);
      } else {
        console.log('Unrecognized Mode', mode);
      }
    });
  }

  addEvent(event: CalendarEvent) {
    this.gcalService.addEvent(event);
  }

  editEvent(event: CalendarEvent) {
    this.gcalService.editEvent(event);

  }

  deleteEvent(event: CalendarEvent) {
    this.gcalService.deleteEvent(event);
  }

  onScrollDown() {
    console.log('Scrolled Down');
  }

  getCalendarInfo() {

  }

  private _buildEventStream() {
    this.eventStream = this.gcalService.eventStream;
    this.calendars = this.gcalService.getCalendars();
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
