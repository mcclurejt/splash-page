import { CalendarEvent } from './../../models/calendar-event';
import { Component, Inject } from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material'
@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})
export class CalendarDialogComponent {

  mode: string;
  event: CalendarEvent;
  
  constructor(@Inject(MD_DIALOG_DATA) public data: any) { 
    this.mode = data[0];
    this.event = data[1];
  }

}
