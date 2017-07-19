import { GapiLoader } from './gapi-loader.service';
import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

interface CalendarList {
  nextPageToken: string,
  items: string[],
}

@Injectable()
export class GoogleService {

  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.modify'
  GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar'

  public isSignedInSubject = new BehaviorSubject<boolean>(this.isSignedIn());
  public googleAuthSubject: Observable<gapi.auth2.GoogleAuth>

  constructor(private router: Router, private gapiLoader: GapiLoader, private zone: NgZone, ) {
    // this.gapiLoader.load()
    this.googleAuthSubject = this.gapiLoader
      .isLoadedSubject
      .asObservable()
      .map<gapi.auth2.GoogleAuth, gapi.auth2.GoogleAuth>
      ((googleAuth: gapi.auth2.GoogleAuth) => {
        console.log(googleAuth);
        return googleAuth;
      });
  }

  load() {
    console.log('LoadAuth');
    this.gapiLoader.load();
    this.googleAuthSubject = this.gapiLoader
      .isLoadedSubject
      .asObservable()
      .map<gapi.auth2.GoogleAuth, gapi.auth2.GoogleAuth>
      ((googleAuth: gapi.auth2.GoogleAuth) => {
        console.log(googleAuth);
        return googleAuth;
      });

  }

  handleUserLogin(result) {
    // Add accessToken to localStorage
    localStorage.setItem('GoogleToken', result.credential.accessToken);
    this.gapiLoader.load();
    this.googleAuthSubject = this.gapiLoader
      .isLoadedSubject
      .asObservable()
      .map<gapi.auth2.GoogleAuth, gapi.auth2.GoogleAuth>
      ((googleAuth: gapi.auth2.GoogleAuth) => {
        console.log(googleAuth);
        return googleAuth;
      });
  }

  signOut() {
    if (this.isSignedInSubject.getValue()) {
      localStorage.removeItem('GoogleToken');
    } else {
      console.log('GoogleService is not signed in, but signout was attempted');
    }
  }

  getCalendarList(): gapi.client.HttpRequest<any> {
    if (this.isSignedInSubject.getValue()) {
      console.log('GoogleService getCalendarList Successful');
      return gapi.client.request({
        path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        method: 'GET',
      });
    }
  };

  getEmailMessagesList(): gapi.client.HttpRequest<any> {
    if (this.isSignedInSubject.getValue()) {
      console.log('GoogleService getEmailMessagesList Successful');
      return gapi.client.request({
        path: 'https://www.googleapis.com/gmail/v1/me/messages',
        method: 'GET',
      });
    }
  }

  isSignedIn() {
    let gapi = window['gapi'];
    let gapiAuthLoaded = gapi && gapi.auth2 && gapi.auth2.getAuthInstance();
    if (gapiAuthLoaded && gapiAuthLoaded.currentUser) {
      console.log('isLoaded', true);
      return true;
    }
    console.log('isLoaded', false);
    return false;
  }

}
