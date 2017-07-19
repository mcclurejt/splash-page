import { CalendarEvent } from './../models/calendar-event';
import { Http } from '@angular/http';
import { GapiLoader } from './gapi-loader.service';
import { AuthService } from './../services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/concat';

@Injectable()
export class GapiService {

  GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.modify';
  GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar';

  public isSignedInStream: Observable<boolean>

  constructor(private gapiLoader: GapiLoader, private http: Http) {
    this.isSignedInStream = gapiLoader.getIsSignedInStream();
  }

  checkIsSignedIn(){
    console.log('checkissignedin',this.gapiLoader.googleUser.isSignedIn());
  }

  signIn() {
    this.gapiLoader.signIn();
  }

  signOut() {
    this.gapiLoader.signOut();
  }

  // Calendar API

  /**
   * Same as CalendarList.list() from Google Calendar Api
   * https://developers.google.com/google-apps/calendar/v3/reference/calendarList/list
   */
  getCalendars(): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      gapi.client.request({
        path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        method: 'GET',
      }).then((response) => {
        resolve(response);
      });
    }));
  }

  /**
   * Same as Events.list() from Google Calendar Api
   * https://developers.google.com/google-apps/calendar/v3/reference/events/list
   * @param cals The calendarList obtained from getCalendars()
   */
  getEvents(cals): Observable<any> {
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
            calEvent.calendar.id = id;
            calEvent.id = event.id;
            calEvent.calendar.summary = summary;
            calEvent.summary = event.summary;
            calEvent.calendar.foregroundColor = foregroundColor;
            calEvent.calendar.backgroundColor = backgroundColor;
            calEvent.timeZone = timeZone;
            calEvent.start = event.start;
            calEvent.end = event.end;
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

  // Email API

  getEmailMessagesList(): Observable<any> {
   return Observable.fromPromise(new Promise((resolve, reject) => {
    gapi.client.request({
      path: 'https://www.googleapis.com/gmail/v1/me/messsages',
      method: 'GET',
    }).then((response) => { 
      resolve(response);
    });
   }));
  }

}

