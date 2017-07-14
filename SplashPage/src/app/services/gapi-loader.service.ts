import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class GapiLoader {

  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.modify'
  GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar'

  isLoadedSubject: Subject<gapi.auth2.GoogleAuth> = new Subject();

  constructor() {
    this.load();
  }

  load() {
    this.isLoadedSubject = new Subject();
    console.log('gapiLoaderLoad');
    let gapi = window['gapi'];
    let isGapiLoaded = gapi && gapi.load;
    if (isGapiLoaded) {
      console.log('isgapiloaded');
      return this.handleClientLoad();
    } else {
      console.log('windowgapiloaded');
      window['handleClientLoad'] = this.handleClientLoad.bind(this);
    }
  }

  handleClientLoad() {
    console.log('handleClientLoad');
    let gapi = window['gapi'];
    let gapiAuthLoaded = gapi && gapi.auth2 && gapi.auth2.getAuthInstance();
    if (gapiAuthLoaded && gapiAuthLoaded.currentUser) {
      console.log('handleclientload if');
      this.isLoadedSubject.next(gapi.auth2.getAuthInstance());
    }
    console.log('Outside Brackets');
    gapi.load('client:auth2', this.initClient.bind(this))
  }

  initClient() {
    console.log('initClient');
    gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: this.DISCOVERY_DOCS,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES
    }).then(() => { this.handleToken() });
  }

  handleToken() {
    console.log('handleToken');
    let gapi = window['gapi'];
    let access_token = localStorage.getItem('GoogleToken');
    gapi.client.setToken({ access_token: access_token });
    this.isLoadedSubject.next(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

}
