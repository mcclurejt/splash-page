import { Calendar } from './../../models/calendar';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent } from '../../models/calendar-event';
import { Subscription } from 'rxjs/Rx';
import { GapiService } from './gapi.service';
import { Observable } from 'rxjs/Observable';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import { GoogleCalendarEvent } from "app/models/google-calendar-event";

@Injectable()
export class GcalService implements OnDestroy {

  private gapiSignedInSubscription: Subscription
  private eventMap = new Map<string, GoogleCalendarEvent>();
  private eventSubject : BehaviorSubject<CalendarEvent[]>;
  private calendars: Array<Calendar> = [];
  private nextSyncToken: string = '';
  public eventStream: Observable<CalendarEvent[]>;
  
  constructor(private gapiService: GapiService) {
    // Initialize the stream of events
    this.eventSubject = new BehaviorSubject([]);
    this.eventStream = this.eventSubject
      .asObservable()
      .filter( (events: CalendarEvent[]) => {
        return events != null;
      })
      .distinctUntilChanged()
      .share();
    this.updateEventStream();
  }

  getCalendars(){
    return this.calendars;
  }

  updateEventStream() {
    this.requestEvents().subscribe((events: CalendarEvent[]) => {
      this.eventSubject.next(events);
    });
  }

  addEvent(event: CalendarEvent) {
    let gcalEvent = new GoogleCalendarEvent();
    // handle dates
    if(event.allDayEvent){
      gcalEvent.start = {
        date: event.startDate,
      }
      gcalEvent.end = {
        date: event.endDate,
      }
    } else {
      gcalEvent.start = {
        dateTime: event.startDate + 'T' + event.startTime + ':00',
        timeZone: event.timeZone,
      }
      gcalEvent.end = {
        dateTime: event.endDate + 'T' + event.endTime + ':00',
        timeZone: event.timeZone,
      }
    }
    gcalEvent.summary = event.summary;
    // send request to add event
    gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/calendars/' + event.calendarId + '/events',
      method: 'POST',
      body: gcalEvent,
    }).then(
      (onFulfilled) => {
        console.log('Event Added OnSuccess', onFulfilled);
        this.updateEventStream();
      },
      (onRejected) => {
        console.log('Event Added OnFailure',onRejected);
      },
    (context) => {
      console.log('Event Added Context',context);
    });
    
  }

  editEvent(event: CalendarEvent) {
    this.updateGoogleCalendarEvent(event);
  }

  deleteEvent(event: CalendarEvent) {
    gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/calendars/' + event.calendarId + '/events/' + event.id,
      method: 'DELETE',
    }).then(
      (onFulfilled) => {
        console.log('Event Deleted OnSuccess', onFulfilled);
        this.updateEventStream();
      },
      (onRejected) => {
        console.log('Event Deleted OnFailure',onRejected);
      },
    (context) => {
      console.log('Event Deleted Context',context);
    });
  }

  updateGoogleCalendarEvent(event: CalendarEvent) {
    let gcalEvent = this.eventMap.get(event.id);
    console.log('GoogleCalendarEvent');
    console.log('CalendarEvent', event);
    // Set start and end based on whether it's an all day event
    if (event.allDayEvent) {
      gcalEvent.start = {
        date: event.startDate,
      }
      gcalEvent.end = {
        date: event.endDate,
      }
    } else {
      gcalEvent.start = {
        dateTime: event.startDate + 'T' + event.startTime + ':00',
        timeZone: event.timeZone,
      }
      gcalEvent.end = {
        dateTime: event.endDate + 'T' + event.endTime + ':00',
        timeZone: event.timeZone,
      }
    }
    // Update event summary
    gcalEvent.summary = event.summary;
    gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/calendars/' + event.calendarId + '/events/' + event.id,
      method: 'PUT',
      body: gcalEvent,
    }).then(
      (onFulfilled) => {
        console.log('Event Updated OnSuccess', onFulfilled);
        this.updateEventStream();
      },
      (onRejected) => {
        console.log('Event Updated OnFailure',onRejected);
      },
    (context) => {
      console.log('Event Updated Context',context);
    });
  }

  /**
   * Returns an observable of CalendarEvents
   */
  requestEvents(): Observable<any> {
    return this.requestCalendars()
      .map((response) => { return response.result })
      .flatMap((calList) => this.getEventsFromCalendars(calList))
      .map((calArray) => this.mapEvents(calArray))
      .share();
  }

  /**
   * Same as CalendarList.list() from Google Calendar Api
   * https://developers.google.com/google-apps/calendar/v3/reference/calendarList/list
   */
  requestCalendars(): Observable<any> {
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
    console.log('Cals', cals);
    this.nextSyncToken = cals.nextSyncToken;
    cals = cals.items;
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
      // Add the calendar to the list
      let calendar = new Calendar();
      calendar.id = cals[i].id;
      calendar.provider = 'google';
      calendar.summary = cals[i].summary;
      calendar.foregroundColor = cals[i].foregroundColor;
      calendar.backgroundColor = cals[i].backgroundColor;
      this.calendars.push(calendar);
      // Add the request to the batch
      let url = 'https://www.googleapis.com/calendar/v3/calendars/' + cals[i].id + '/events'
      let req = gapi.client.request({
        path: url,
        method: 'GET',
        params: params,
      });
      batch.add(req, { 'id': cals[i].id });
    }
    // Execute the request and return the events along with calendar data
    return Observable.fromPromise(new Promise((resolve) => {
      batch.execute((response, other) => resolve([response, cals]));
    }));
  }

  /**
   * Takes in a calendarList.list() and array of events.list() and converts
   * it to an array of calendarEvents
   * @param calEventArray 
   */
  mapEvents(calEventArray): CalendarEvent[] {
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
            // Add the event to the map
            let gCalEvent = Object.setPrototypeOf(event, GoogleCalendarEvent.prototype);
            this.eventMap.set(event.id, gCalEvent);
            calEvent.calendarId = id;
            calEvent.id = event.id;
            calEvent.calendarSummary = summary;
            calEvent.summary = event.summary;
            calEvent.timeZone = timeZone;
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
              calEvent.startTime = startDateTime[1].split('-')[0].substr(0, 5);
              calEvent.endDate = endDateTime[0];
              calEvent.endTime = endDateTime[1].split('-')[0].substr(0, 5);
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
