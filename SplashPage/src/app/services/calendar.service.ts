import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Injectable } from '@angular/core';
import { GapiService } from "app/content-providers/google/gapi.service";
import { GcalService } from "app/content-providers/google/gcal.service";
import { CalendarEvent } from "app/models/calendar-event";
import { CalendarDialogComponent } from "app/components/calendar-dialog/calendar-dialog.component";

@Injectable()
export class CalendarService {

  public eventStream: Observable<CalendarEvent[]>;
  public todaysDate: string;

  constructor(private gapiService: GapiService, public gcalService: GcalService, public dialog: MdDialog) {
    this._buildEventStream();
    this._setTodaysDate();
  }

  openDialog(mode: string, event: CalendarEvent){
     let dialogRef = this.dialog.open(CalendarDialogComponent, {
      data: [mode,event],
      height: '400px',
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog Result: ',result);
    });
  }

  addEvent(event: CalendarEvent) {
    console.log('Event Added',event);
  }

  editEvent(event: CalendarEvent){
    console.log('Event Edited',event);
  }

  private _buildEventStream() {
    this.eventStream = this.gcalService.eventStream;
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
