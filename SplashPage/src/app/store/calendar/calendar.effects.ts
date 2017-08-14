import { CalendarEvent } from './calendar-event';
import { GcalService } from './../../content-providers/google/gcal.service';
import { CalendarService } from 'app/services/calendar.service';
import * as CalendarActions from 'app/store/calendar/calendar.actions';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as fromRoot from 'app/store/reducers';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/bufferTime';
import { Calendar } from "app/store/calendar/calendar";

@Injectable()
export class CalendarEffects {

  constructor(private actions: Actions, private store: Store<fromRoot.State>, private gcalService: GcalService) { }

  @Effect() onStateChange: Observable<CalendarActions.All> = this.actions.ofType(CalendarActions.ON_STATE_CHANGE)
    .do(() => this.store.dispatch(new CalendarActions.StartLoading()))
    .switchMap(() => this.gcalService.getCalendars())
    .switchMap((calendars: Calendar[]) => {
      this.store.dispatch(new CalendarActions.CalendarAdd(calendars));
      return this.gcalService.getEvents(calendars)
    })
    .map((events: CalendarEvent[]) => {
      this.store.dispatch(new CalendarActions.HandleEventAdd(events));
      return new CalendarActions.StopLoading();
    })

  @Effect() addEvent: Observable<CalendarActions.All> = this.actions.ofType(CalendarActions.EVENT_ADD)
    .map(toPayload)
    .switchMap((payload) => {
      let event = payload.event;
      let calendars = payload.calendars;
      let provider = calendars.find((calendar) => calendar.id == event.calendarId).provider;
      return this.gcalService.addEvent(event, calendars).catch((error) => {
        console.log('Error when adding event', error);
        return Observable.of(null);
      });

    })
    .map((event: CalendarEvent) => new CalendarActions.HandleEventAdd(event));

  @Effect() editEvent: Observable<CalendarActions.All> = this.actions.ofType(CalendarActions.EVENT_EDIT)
    .map(toPayload)
    .switchMap((payload) => {
      let event = payload.event;
      let newEvent = payload.newEvent;
      let calendars = payload.calendars;
      let eventProvider = calendars.find((calendar) => calendar.id == event.calendarId).provider;
      let newEventProvider = calendars.find((calendar) => calendar.id == newEvent.calendarId).provider;
      let actions = [];
      switch (eventProvider) {
        case 'google': {
          actions.push(new CalendarActions.EventDelete({ event: event, calendars: calendars }));
          break;
        }
        default: {
          console.log('Calendar Provider Not Found');
        }
      }
      switch (newEventProvider) {
        case 'google': {
          actions.push(new CalendarActions.EventAdd({ event: newEvent, calendars: calendars }));
          break;
        }
        default: {
          console.log('Calendar Provider Not Found');
        }
      }
      return actions;
    });

  @Effect() deleteEvent: Observable<CalendarActions.All> = this.actions.ofType(CalendarActions.EVENT_DELETE)
    .map(toPayload)
    .switchMap((payload) => {
      let event = payload.event;
      let calendars = payload.calendars;
      let provider = calendars.find((calendar) => calendar.id == event.calendarId).provider;
      switch (provider) {
        case 'google': {
          return this.gcalService.deleteEvent(event, calendars).catch((error) => {
            console.log('Error when deleting event', error);
            return Observable.of(null);
          });
        }
        default: {
          console.log('Calendar Provider Not Found');
        }
      }
    })
    .map((event) => new CalendarActions.HandleEventDelete(event));

}