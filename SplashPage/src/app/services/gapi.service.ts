import { GapiLoader } from './gapi-loader.service';
import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';

export interface CalendarList {
  items: string[],
}

@Injectable()
export class GapiService {

  GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.modify';
  GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar';

  public isLoadedStream: Observable<boolean>

  constructor(private gapiLoader: GapiLoader) {
    this.isLoadedStream = this.gapiLoader.getLoadedStream();
  }

  getCalendarList(): Promise<CalendarList> {
    return gapi.client.request({
      path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      method: 'GET',
    }).then((response) => {
      return this.parseCalendarList(response);
    })
  }

  parseCalendarList(response): CalendarList {
    return {
      items: response.result.items
    }
  }

  handleUserLogin(result) {
    this.gapiLoader.updateToken(result.credential.accessToken);
  }

  signOut() {
    this.gapiLoader.signOut();
  }

}
