import { Response } from '@angular/http';
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

  deleteEvent(event: CalendarEvent, calendars: Calendar[]): Observable<CalendarEvent> {
    return Observable.fromPromise(gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/calendars/' + event.calendarId + '/events/' + event.id,
      method: 'DELETE',
    })).map((response) => event);
  }

  getCalendars(): Observable<Calendar[]> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      this.gapiService.getIsSignedInStream().subscribe((isSignedIn) => {
        if (isSignedIn) {
          gapi.client.request({
            path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
            method: 'GET',
          }).then((response) => resolve(this._mapCalendars(response.result)));
        }
      });
    }));
  }

  getEvents(calendars: Calendar[], startDate: Date = this.getFirstDayOfWeek()): Observable<CalendarEvent[]> {
    let gapi = window['gapi'];
    let batch = gapi.client.newBatch();
    let params = {
      orderBy: 'startTime',
      singleEvents: 'True',
      timeMin: this._getRFC3339Date(startDate),
    };
    for (let calendar of calendars) {
      let url = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendar.id) + '/events'
      let req = gapi.client.request({
        path: url,
        method: 'GET',
        params: params,
      });
      batch.add(req);
    }
    return Observable.fromPromise(batch)
      .map((eventsResp: any) => {
        eventsResp = eventsResp.result;
        let events = [];
        for (let key of _.keys(eventsResp)) {
          let googleEvents = eventsResp[key].result.items;
          let calendarEvents = this._mapEvents(googleEvents, calendars.find((calendar) => calendar.summary == eventsResp[key].result.summary));
          events.push(...calendarEvents);
        }
        return events;
      })
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

  private _mapEvents(events: any, calendar: Calendar): Array<CalendarEvent> {
    if (events == null) {
      return [];
    }
    let calendarEvents = [];
    for (let event of events) {
      let calendarEvent = this._mapGoogleEventToCalendarEvent(event, calendar);
      calendarEvents.push(calendarEvent);
    }
    return calendarEvents;
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
      let sd = googleEvent.start.date.split('-');
      let ed = googleEvent.end.date.split('-');
      calendarEvent.startDate = new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))
      calendarEvent.endDate = new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]))
      calendarEvent.allDayEvent = true;
    } else {
      let startDateTime = googleEvent.start.dateTime.split('T');
      let endDateTime = googleEvent.end.dateTime.split('T');
      let sd = startDateTime[0].split('-');
      let st = startDateTime[1].split('-')[0].substr(0, 5).split(':');
      let ed = endDateTime[0].split('-');
      let et = endDateTime[1].split('-')[0].substr(0, 5).split(':');
      calendarEvent.startDate = new Date(parseInt(sd[0]), parseInt(sd[1]) - 1, parseInt(sd[2]), parseInt(st[0]), parseInt(st[1]));
      calendarEvent.endDate = new Date(parseInt(ed[0]), parseInt(ed[1]) - 1, parseInt(ed[2]), parseInt(et[0]), parseInt(et[1]));
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
        date: event.startDate.getFullYear() + '-' + (event.startDate.getMonth() + 1) + '-' + event.startDate.getDate(),
      }
      googleEvent.end = {
        date: event.endDate.getFullYear() + '-' + (event.endDate.getMonth() + 1) + '-' + event.endDate.getDate(),
      }
    } else {
      googleEvent.start = {
        dateTime: event.startDate.getFullYear() + '-' + (event.startDate.getMonth() + 1) + '-' + event.startDate.getDate() + 'T' + event.startDate.getHours() + ':' + event.startDate.getMinutes() + ':00',
        timeZone: event.timeZone,
      }
      //2017-08-10T06:30:00-05:00
      googleEvent.end = {
        dateTime: event.endDate.getFullYear() + '-' + (event.endDate.getMonth() + 1) + '-' + event.endDate.getDate() + 'T' + event.endDate.getHours() + ':' + event.endDate.getMinutes() + ':00',
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
    let newDate = new Date(d.setDate(diff));
    newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    return newDate;
  }

}
