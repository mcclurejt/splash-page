import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/share';

@Injectable()
export class GapiService implements OnDestroy {

  SCRIPT_URL = 'https://apis.google.com/js/api.js?onload=handleClientLoad';
  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  // SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar'; //Uncomment when modify scope is actually necessary
  SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar'

  private tokenSubscription: Subscription;
  private isSignedInSubject = new BehaviorSubject<boolean>(false);

  getIsSignedInStream(): Observable<boolean> {
    return this.isSignedInSubject.asObservable().distinctUntilChanged().share();
  }

  constructor() {
    this.loadScript();
  }

  handleClientLoad(): void {
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  initClient() {
    gapi.client.init({
      'apiKey': this.API_KEY,
      'discoveryDocs': this.DISCOVERY_DOCS,
      'clientId': this.CLIENT_ID,
      'scope': this.SCOPES,
    }).then(
      // Fulfilled
      () => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus.bind(this));
        this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      },
      (error) => {
        console.log('Error in gapi.client.init() : ',error);
      });
  }

  updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
      this.isSignedInSubject.next(true);
    } else {
      this.isSignedInSubject.next(false);
    }
  }

  signIn(): Promise<gapi.auth2.GoogleUser> {
    let gapi = window['gapi'];
    return gapi.auth2.getAuthInstance().signIn({
      prompt: 'select_account',
    });
  }

  signOut() {
    gapi.auth2.getAuthInstance().signOut();
  }

  startTokenTimer(access_token: string, timeInSeconds: number) {
    let dueTimeInMs = (timeInSeconds - 60) * 1000;
    console.log('Start token timer for: ' + timeInSeconds + 'ms');
    this.tokenSubscription = Observable.timer(dueTimeInMs)
      .subscribe((num: number) => {
        gapi.auth2.getAuthInstance()
          .currentUser.get()
          .reloadAuthResponse()
          .then((authResponse: gapi.auth2.AuthResponse) => {
            console.log('Auth Response Reloaded');
            this.startTokenTimer(authResponse.access_token, authResponse.expires_in);
          })
      })
  }

  ngOnDestroy() {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }

  private loadScript() {
    let node = document.createElement('script');
    node.src = this.SCRIPT_URL;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
    window['handleClientLoad'] = this.handleClientLoad.bind(this);
  }

}

