import { GapiLoader } from './gapi-loader.service';
import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable()
export class GapiService {

  GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.modify';
  GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar';

  public isLoadedStream: Observable<boolean>

  constructor(private gapiLoader: GapiLoader) {
    this.isLoadedStream = this.gapiLoader.getLoadedStream();
  }

  handleUserLogin(result) {
    this.gapiLoader.updateToken(result.credential.accessToken);
  }

  signOut() {
    this.gapiLoader.signOut();
  }

  // Calendar API

  /**
   * handles the obtaining of calendars and their events when the calendar component is loaded
   */
  loadCalendars() {
    return this
      .getCalendars()
      .then((cals: GoogleCalendarList[]) => this.getEvents(cals))
  }

  /**
   * Same as CalendarList.list() from Google Calendar Api
   * https://developers.google.com/google-apps/calendar/v3/reference/calendarList/list
   */
  getCalendars(): Promise<GoogleCalendarList[]> {
    return gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      method: 'GET',
    }).then((response) => {
      // console.log('CalendarList.list()', response);
      return this.parseCalendars(response);
    })
  }

  /**
   * Same as Events.list() from Google Calendar Api
   * https://developers.google.com/google-apps/calendar/v3/reference/events/list
   * @param cals The calendarList obtained from getCalendars()
   */
  getEvents(cals: GoogleCalendarList[]): Promise<any> {
    let gapi = window['gapi']
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
    return batch
      .then((response) => { return this.parseEvents(response, cals) })
  }

  /**
   * Assigns the events to Objects matching Event resource from Google Calendar Api
   * @param response Http Response from CalendarList.list() call
   */
  private parseCalendars(response): GoogleCalendarList[] {
    let calendars = [];
    for (let i = 0; i < response.result.items.length; i++) {
      let calProto = Object.assign(response.result.items[i], GoogleCalendarList.prototype)
      calendars.push(calProto);
    }
    return calendars;
  }

  /**
   * Assigns the events to Objects matching Event resource from Google Calendar Api
   * @param response Http Batch Response from all calendar's Events.list() call
   * @param cals Parsed GoogleCalendarList[] stemming from CalendarList.list()
   */
  private parseEvents(response, cals: GoogleCalendarList[]) {
    let events = [];
    for (let i = 0; i < cals.length; i++) {
      let calId = cals[i].id;
      if (response.result[calId].status == 200) {
        let eventProto = Object.assign(response.result[calId].result, GoogleEvent.prototype)
        events.push(eventProto);
      } else {
        //console.log('Calendar not found', response.result[calId]);
      }
    }
    //console.log('Events', events);
    return events;
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

}

export class GoogleCalendarList {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  description: string;
  location: string;
  timeZone: string;
  summaryOverride: string;
  colorId: string;
  backgroundColor: string;
  foregroundColor: string;
  hidden: boolean;
  selected: boolean;
  accessRole: string;
  defaultReminders: [
    {
      method: string,
      minutes: number,
    }
  ]
  notificationSettings: {
    notifications: [
      {
        type: string,
        method: string,
      }
    ]
  }
  primary: boolean;
  deleted: boolean;
}

export class GoogleEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  colorId: string;
  creator: {
    id: string,
    email: string,
    displayName: string,
    self: boolean
  }
  organizer: {
    id: string,
    email: string,
    displayName: string,
    self: boolean
  }
  start: {
    date: string,
    dateTime: string,
    timeZone: string,
  }
  end: {
    date: string
    dateTime: string,
    timeZone: string,
  }
  endTimeUnspecified: boolean;
  recurrence: [
    string
  ]
  recurringEventId: string;
  originalStartTime: {
    date: string,
    dateTime: string,
    timeZone: string
  }
  transparency: string;
  visibility: string
  iCalUID: string
  sequence: number;
  attendees: [
    {
      id: string,
      email: string,
      displayName: string,
      organizer: boolean,
      self: boolean,
      resource: boolean,
      optional: boolean,
      responseStatus: string,
      comment: string,
      additionalGuests: number
    }
  ]
  attendeesOmitted: boolean
  extendedProperties: {
    private: {
      (key): string
    }
    shared: {
      (key): string
    }
  }
  hangoutLink: string
  gadget: {
    type: string
    title: string
    link: string
    iconLink: string
    width: number
    height: number
    display: string
    preferences: {
      (key): string
    }
  }
  anyoneCanAddSelf: boolean
  guestsCanInviteOthers: boolean
  guestsCanModify: boolean
  guestsCanSeeOtherGuests: boolean
  privateCopy: boolean
  locked: boolean
  reminders: {
    useDefault: boolean
    overrides: [
      {
        method: string
        minutes: number
      }
    ]
  }
  source: {
    url: string
    title: string
  }
  attachments: [
    {
      fileUrl: string
      title: string
      mimeType: string
      iconLink: string
      fileId: string
    }
  ]
}