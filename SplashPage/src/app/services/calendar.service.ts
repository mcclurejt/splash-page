import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Injectable, OnInit } from '@angular/core';
import { GcalService } from "app/content-providers/google/gcal.service";
import { CalendarEvent } from "app/store/calendar/calendar-event";
import { CalendarDialogComponent } from "app/components/calendar-dialog/calendar-dialog.component";
import { Calendar } from "app/store/calendar/calendar";

import { Store } from "@ngrx/store";
import * as CalendarActions from 'app/store/calendar/calendar.actions';
import * as fromRoot from 'app/store/reducers';

import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/observable/interval';

@Injectable()
export class CalendarService {

  private calendarsLoaded = false;
  public calendars: Observable<Calendar[]>;
  public events: Observable<CalendarEvent[]>;

  constructor(public gcalService: GcalService, public dialog: MdDialog, private store: Store<fromRoot.State>) {
    this.calendars = this.store.select(state => state.calendar.calendars);
    this.events = this.store.select(state => state.calendar.events);
  }

  loadAllCalendars() {
    if (this.calendarsLoaded) {
      this.gcalService.updateCalendars();
    } else {
      console.log('Load All Calendars');
      this.gcalService.loadCalendars();
      this.calendarsLoaded = true;
    }
  }

  addEvent(event: CalendarEvent, calendars: Calendar[]): void {
    this.gcalService.addEvent(event, calendars);
  }

  editEvent(event: CalendarEvent, newEvent: CalendarEvent, calendars: Calendar[]): void {
    this.gcalService.editEvent(event, newEvent, calendars);
  }

  deleteEvent(event: CalendarEvent): void {
    this.gcalService.deleteEvent(event);
  }

  onScrollDown() {
    console.log('Scrolled Down');
  }

  openDialog(mode: string, event: CalendarEvent) {
    let height;
    let width;
    switch (mode) {
      case ('Add'): {
        height = '550px';
        width = '400px';
        break;
      }
      case ('Edit'): {
        height = '550px';
        width = '400px';
        break;
      }
      case ('Delete'): {
        height = '170px';
        width = '400px';
        break;
      }
    }

    let dialogRef = this.dialog.open(CalendarDialogComponent, {
      data: {
        mode: mode,
        event: event,
      },
      height: height,
      width: width,
    });
    dialogRef.afterClosed()
      .withLatestFrom(this.calendars)
      .subscribe((result) => {
        if (result[0] == null) {
          console.log('Dialog closed, no changes made.', Object.keys(result[1]));
          return;
        }
        let mode = result[0][0];
        let event = result[0][1];
        let newEvent = result[0][2];
        let calendars = result[1];
        if (mode == 'Add') {
          this.addEvent(newEvent, calendars);
        } else if (mode == 'Edit') {
          this.editEvent(event, newEvent, calendars);
        } else if (mode == 'Delete') {
          this.deleteEvent(event);
        } else {
          console.log('Unrecognized Mode', mode);
        }
      });
  }
}
