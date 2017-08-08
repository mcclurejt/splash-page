import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store/reducers';
import * as CalendarActions from 'app/store/calendar/calendar.actions';
import { Calendar } from 'app/store/calendar/calendar';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Subscription } from 'rxjs/Rx';
import { GapiService } from './gapi.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/combineAll';

import * as _ from "lodash";

@Injectable()
export class GcalService {

  constructor(private gapiService: GapiService, private store: Store<fromRoot.State>) { }

  addEvent(event: CalendarEvent, calendars: Calendar[]): Observable<CalendarEvent> {
    let googleEvent = this._mapCalendarEventToGoogleEvent(event);
    // send request to add event
    return Observable.fromPromise(gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/calendars/' + event.calendarId + '/events',
      method: 'POST',
      body: googleEvent,
    })).map((response) => {
      let calendarEvent = this._mapGoogleEventToCalendarEvent(response.result, calendars.find((calendar) => calendar.id == event.calendarId));
      console.log('GcalService Event Added');
      return calendarEvent;
    });
  }

  deleteEvent(event: CalendarEvent, calendars : Calendar[]) : Observable<CalendarEvent> {
    return Observable.fromPromise(gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/calendars/' + event.calendarId + '/events/' + event.id,
      method: 'DELETE',
    })).map((response) => event);
  }

  updateCalendars() {
    console.log('TODO: implement updating calendars with synctoken');
  }

  loadCalendars(startDate?: Date): Observable<Array<any>> {
    console.log('Loading Calendars');
    return this._requestCalendars()
      .flatMap(response => Observable.from(this._mapCalendars(response.result)))
      .flatMap(calendar => this._requestEvents(calendar, startDate))
      .map((respCalArray) => this._mapEvents(respCalArray));
  }

  private _requestCalendars(): Observable<any> {
    console.log('Requesting Calendars');
    return Observable.fromPromise(new Promise((resolve, reject) => {
      this.gapiService.getIsSignedInStream().subscribe((isSignedIn) => {
        if (isSignedIn) {
          gapi.client.request({
            path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
            method: 'GET',
          }).then((response) => { resolve(response); });
        }
      });
    }));
  }

  private _mapCalendars(calendarListResp: any): Calendar[] {
    let syncToken = calendarListResp.nextSyncToken;
    // First make list of objects with necessary Calendar Data
    let calArray = new Array<Calendar>();
    for (let cal of calendarListResp.items) {
      let calendar = new Calendar({
        id: cal.id,
        provider: 'google',
        summary: cal.summary,
        foregroundColor: cal.foregroundColor,
        backgroundColor: cal.backgroundColor,
        syncToken: syncToken,
        timeZone: cal.timeZone,
      });
      calArray.push(calendar);
    }
    return calArray;
  }

  private _requestEvents(calendar, startDate?: Date): Observable<any> {
    let d = startDate || this.getFirstDayOfWeek();
    let params = {
      orderBy: 'startTime',
      singleEvents: 'True',
      timeMin: this._getRFC3339Date(d),
    };
    let id = calendar.id;
    let url = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(id) + '/events'
    let req = gapi.client.request({
      path: url,
      method: 'GET',
      params: params,
    });
    return Observable.fromPromise(new Promise((resolve) => {
      req.then(
        (onFulfilled) => {
          resolve([onFulfilled, calendar]);
        },
        (onRejected) => {
          resolve([onRejected, calendar]);
        });
    }));
  }

  private _mapEvents(respCalArray): Array<any> {
    // Split apart the passed in structure
    let eventResp = respCalArray[0].result;
    let calendar = respCalArray[1];
    // Get array of events from response 
    let events = eventResp.items;
    if (events == undefined) {
      events = [];
    }
    let calendarEvents = [];
    for (let event of events) {
      let calendarEvent = this._mapGoogleEventToCalendarEvent(event, calendar);
      calendarEvents.push(calendarEvent);
    }
    return [calendarEvents, calendar];
  }

  /**
   * Maps a google calendar event to a CalendarEvent
   */
  private _mapGoogleEventToCalendarEvent(googleEvent, calendar: Calendar): CalendarEvent {
    let calendarEvent = new CalendarEvent({
      id: googleEvent.id,
      summary: googleEvent.summary,
      foregroundColor: calendar.foregroundColor,
      backgroundColor: calendar.backgroundColor,
      calendarId: calendar.id,
      timeZone: calendar.timeZone,
      provider: 'google',
    });
    // Apply the correct fields based on whether the event is all day
    if (googleEvent.start.date != null) {
      calendarEvent.startDate = googleEvent.start.date;
      calendarEvent.endDate = googleEvent.end.date;
      calendarEvent.allDayEvent = true;
    } else {
      let startDateTime = googleEvent.start.dateTime.split('T');
      let endDateTime = googleEvent.end.dateTime.split('T');
      calendarEvent.startDate = startDateTime[0];
      calendarEvent.startTime = startDateTime[1].split('-')[0].substr(0, 5);
      calendarEvent.endDate = endDateTime[0];
      calendarEvent.endTime = endDateTime[1].split('-')[0].substr(0, 5);
      calendarEvent.allDayEvent = false;
    }
    return calendarEvent;
  }

  private _mapCalendarEventToGoogleEvent(event: CalendarEvent) {
    let googleEvent = {
      start: {},
      end: {},
      summary: event.summary,
    }
    // handle dates
    if (event.allDayEvent) {
      googleEvent.start = {
        date: event.startDate,
      }
      googleEvent.end = {
        date: event.endDate,
      }
    } else {
      googleEvent.start = {
        dateTime: event.startDate + 'T' + event.startTime + ':00',
        timeZone: event.timeZone,
      }
      googleEvent.end = {
        dateTime: event.endDate + 'T' + event.endTime + ':00',
        timeZone: event.timeZone,
      }
    }
    return googleEvent;
  }


  /**
   * Returns the provided date in RFC3339 format to be used in requests to Google's Apis
   * @param d Date object representing the desired date
   */
  private _getRFC3339Date(d: Date): string {
    let pad = (n) => { return n < 10 ? "0" + n : n; };
    let timezoneOffset = (offset) => {
      let sign;
      if (offset === 0) {
        return 'Z';
      }
      sign = (offset > 0) ? '-' : '+';
      offset = Math.abs(offset);
      return sign + pad(Math.floor(offset / 60)) + ':' + pad(offset % 60);
    }
    return d.getFullYear() + "-" +
      pad(d.getMonth() + 1) + "-" +
      pad(d.getDate()) + "T" +
      pad(d.getHours()) + ":" +
      pad(d.getMinutes()) + ":" +
      pad(d.getSeconds()) +
      timezoneOffset(d.getTimezoneOffset());
  }
  /**
   * Returns the Date object representing the first day of the week
   */
  private getFirstDayOfWeek(): Date {
    let d = new Date();
    let day = d.getDay();
    let diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

}
