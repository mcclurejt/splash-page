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

import * as _ from 'lodash';

import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/observable/interval';

@Injectable()
export class CalendarService {
  
  public calendars: Observable<Calendar[]>;
  public events: Observable<CalendarEvent[]>;
  public loading: Observable<boolean>;

  constructor(public gcalService: GcalService, public dialog: MdDialog, private store: Store<fromRoot.State>) {
    this.calendars = this.store.select(state => state.calendar.calendars);
    this.events = this.store.select(state => state.calendar.events);
    this.loading = this.store.select(state => state.calendar.loading);
  }

  onScrollDown() {
    console.log('Scrolled Down');
  }

  openDialog(mode: string, event: CalendarEvent) {
    let dialogRef = this.dialog.open(CalendarDialogComponent, {
      data: {
        mode: mode,
        event: event,
        calendars: this.calendars,
      },
    });
    dialogRef.afterClosed()
      .withLatestFrom(this.calendars)
      .subscribe((result) => {
        if (result[0] == null) {
          console.log('Dialog closed, no changes made.');
          return;
        }
        let mode = result[0][0];
        let event = result[0][1];
        let newEvent = result[0][2];
        let calendars = result[1];
        if (mode == 'Add') {
          this.store.dispatch(new CalendarActions.EventAdd({event: newEvent,calendars: calendars}));
        } else if (mode == 'Edit') {
          this.store.dispatch(new CalendarActions.EventEdit({event: event,newEvent: newEvent,calendars: calendars}));
        } else if (mode == 'Delete') {
          this.store.dispatch(new CalendarActions.EventDelete({event: event,calendars: calendars}));
        } else {
          console.log('Unrecognized Mode', mode);
        }
      });
  }
}
