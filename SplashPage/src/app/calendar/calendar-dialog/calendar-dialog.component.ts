import { CalendarService } from './../../services/calendar.service';
import { CalendarComponent } from './../calendar.component';
import { CalendarEvent } from './../../models/calendar-event';
import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})
export class CalendarDialogComponent {

  mode: string;
  event: CalendarEvent;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialogueRef: MdDialogRef<CalendarDialogComponent>) {
    this.mode = data[0];
    this.event = data[1];
  }

  closeDialog() {
    this.dialogueRef.close([this.mode,this.event]);
  }

}
