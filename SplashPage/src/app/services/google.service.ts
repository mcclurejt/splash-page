import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

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

  public isSignedInSubject = new BehaviorSubject<boolean>(this.hasToken())

  constructor(private af: AngularFireAuth, private router: Router) {
    if (this.isSignedInSubject.getValue()) {
      this.handleAuthLoad();
    } else {
      console.log('User Not Signed In!!');
    }
  }

  initializeApi(result) {
    // Add accessToken to localStorage
    localStorage.setItem('GoogleToken', result.credential.accessToken);
    this.isSignedInSubject.next(result.credential.accessToken);
    this.handleAuthLoad();
  }

  handleAuthLoad() {
    gapi.load('client', this.initClient.bind(this))
  }

  initClient() {
    gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: this.DISCOVERY_DOCS,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES
    }).then(() => {
      let gapi = window['gapi'];
      let access_token = localStorage.getItem('GoogleToken');
      gapi.client.setToken({ access_token: access_token });
      this.isSignedInSubject.next(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  signOut() {
    if (this.isSignedInSubject.getValue()) {
      localStorage.removeItem('GoogleToken');
      this.isSignedInSubject.next(false);
    } else {
      console.log('GoogleService is not signed in, but signout was attempted');
    }
  }

  // API METHODS

  getCalendarList() {
    if (this.hasToken()) {
      return gapi.client.request({
        path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        method: 'GET',
      }).then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        });
    }
  }

  parseCalendarList(jsonResp, rawResp) {

    return []
  }

  getBatch(): gapi.client.HttpBatch {
    console.log('gapi.getBatch()');
    let batch: gapi.client.HttpBatch = window['gapi'].client.newBatch();
    return batch;
  }

  getRequest(params): gapi.client.HttpRequest<any> {
    console.log('gapi.getRequest()');
    return window['gapi'].client.request(params);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('GoogleToken');
  }

}
