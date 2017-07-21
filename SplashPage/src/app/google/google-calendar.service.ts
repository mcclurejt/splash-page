import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent } from './../models/calendar-event';
import { Subscription } from 'rxjs/Rx';
import { GapiService } from './gapi.service';
import { Observable } from 'rxjs/Observable';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class GoogleCalendarService implements OnDestroy {

  private gapiSignedInSubscription: Subscription
  public allEventStream: Observable<CalendarEvent[]>;


  constructor(private gapiService: GapiService) {
    // Build the streams once gapi is done loading
    this.gapiSignedInSubscription = this.gapiService.getIsSignedInStream()
      .subscribe((isSignedIn: boolean) => {
        this.buildStream();
      });
  }

  buildStream() {
    this.allEventStream = this.getEvents().share();
  }

  /**
   * Returns an observable of CalendarEvents
   */
  getEvents(): Observable<any> {
    return this.getCalendars()
      .map((response) => { return response.result.items })
      .flatMap((calList) => this.getEventsFromCalendars(calList))
      .map((calArray) => this.mapEvents(calArray))
      .distinctUntilChanged()
      .share();
  }

  /**
   * Same as CalendarList.list() from Google Calendar Api
   * https://developers.google.com/google-apps/calendar/v3/reference/calendarList/list
   */
  getCalendars(): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      this.gapiService.getIsSignedInStream().subscribe((isSignedIn) => {
        if (isSignedIn) {
          gapi.client.request({
            path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
            method: 'GET',
          }).then((response) => {
            resolve(response);
          });
        }
      });
    }));
  }

  /**
   * Same as Events.list() from Google Calendar Api
   * https://developers.google.com/google-apps/calendar/v3/reference/events/list
   * @param cals The calendarList obtained from getCalendars()
   */
  getEventsFromCalendars(cals): Observable<any> {
    console.log('Google CalendarList', cals);
    let gapi = window['gapi'];
    let batch = gapi.client.newBatch();
    let d = this.getFirstDayOfWeek();
    let params = {
      orderBy: 'startTime',
      singleEvents: 'True',
      timeMin: this.getRFC3339Date(d),
    }
    // Iterate through all the calendars to get dates for each
    for (let i = 0; i < cals.length; i++) {
      let calId = cals[i].id;
      let url = 'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events'
      let req = gapi.client.request({
        path: url,
        method: 'GET',
        params: params,
      });
      batch.add(req, { 'id': calId });
    }
    // Execute the request and send the results to get parsed before returning
    return Observable.fromPromise(new Promise((resolve, reject) => {
      batch.execute((response) => resolve([response, cals]), reject);
    }));
  }

  /**
   * Takes in a calendarList.list() and array of events.list() and converts
   * it to an array of calendarEvents
   * @param calEventArray 
   */
  mapEvents(calEventArray): CalendarEvent[] {
    console.log('calEventArray', calEventArray);
    // Pull out the goodies from calArray
    let eventArray = calEventArray[0];
    let calArray = calEventArray[1];
    // Initialize what we'll eventually return
    let eventList: CalendarEvent[] = []
    for (let cal of calArray) {
      // Add the background and foreground colors of the cals to the event arrays
      eventArray[cal.id].backgroundColor = cal.backgroundColor;
      eventArray[cal.id].foregroundColor = cal.foregroundColor;
      let eventCal = eventArray[cal.id];
      if (eventCal.result && !(eventCal.result.error)) {
        let id = eventCal.id;
        let summary = eventCal.result.summary;
        let timeZone = eventCal.result.timeZone;
        let foregroundColor = eventCal.foregroundColor;
        let backgroundColor = eventCal.backgroundColor;
        if (eventCal.result != 'Not Found' && eventCal.result.items != null) {
          for (let event of eventCal.result.items) {
            let calEvent = new CalendarEvent();
            calEvent.calendarId = id;
            calEvent.id = event.id;
            calEvent.calendarSummary = summary;
            calEvent.summary = event.summary;
            calEvent.calendarForegroundColor = foregroundColor;
            calEvent.calendarBackgroundColor = backgroundColor;
            if (event.start.date != null) {
              calEvent.startDate = event.start.date;
              calEvent.startTime = '00:00';
              calEvent.endDate = event.end.date;
              calEvent.endTime = '00:00';
              calEvent.allDayEvent = true;
            } else {
              let startDateTime = event.start.dateTime.split('T');
              let endDateTime = event.end.dateTime.split('T');
              calEvent.startDate = startDateTime[0];
              calEvent.startTime = startDateTime[1].split('-')[0].substr(0,5);
              calEvent.endDate = endDateTime[0];
              calEvent.endTime = endDateTime[1].split('-')[0].substr(0,5);
              calEvent.allDayEvent = false;
            }
            eventList.push(calEvent);
          }
        }
      }
    }
    return eventList;
  }

  /**
   * Returns the provided date in RFC3339 format to be used in requests to Google's Apis
   * @param d Date object representing the desired date
   */
  private getRFC3339Date(d: Date): string {
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

  ngOnDestroy() {
    if (this.gapiSignedInSubscription) {
      this.gapiSignedInSubscription.unsubscribe();
    }
  }

}
