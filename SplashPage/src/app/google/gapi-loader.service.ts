import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/observable/timer';

@Injectable()
export class GapiLoader {

  SCRIPT_URL = 'https://apis.google.com/js/api.js?onload=onApiLoaded';
  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar'

  private tokenTimer: Subscription;

  googleAuth: gapi.auth2.GoogleAuth;
  googleUser: gapi.auth2.GoogleUser;

  isSignedInSubject = new BehaviorSubject<boolean>(this.isSignedIn());

  getIsSignedInStream(): Observable<boolean> {
    return this.isSignedInSubject.asObservable().distinctUntilChanged().share();
  }

  constructor(private afAuth: AngularFireAuth) {
    this.loadScript();
  }

  handleClientLoad(): void {
    console.log('handleClientLoad');
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  initClient() {
    console.log('initClient');
    this.googleAuth = gapi.auth2.init({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
    });

    // Listen for sign-in state changes
    this.googleAuth.isSignedIn.listen(this.signInChanged.bind(this));

    // Listen for changes to current user
    this.googleAuth.currentUser.listen(this.userChanged.bind(this));

    // Sign in the user if they are currently signed in
    if (this.googleAuth.isSignedIn.get() == true) {
      this.googleAuth.signIn().then((googleUser) => this.handleSignIn(googleUser));
    }
    this.refreshValues();
  }

  signInChanged(isSignedIn: boolean): void {
    console.log('isLoadedSubject.next() signInChanged', isSignedIn);
    this.isSignedInSubject.next(isSignedIn);
  }

  userChanged(googleUser: gapi.auth2.GoogleUser): void {
    console.log('userChanged', googleUser);
    this.googleUser = googleUser;
  }

  refreshValues(): void {
    this.googleAuth = gapi.auth2.getAuthInstance();
    this.googleUser = this.googleAuth.currentUser.get();
  }

  signIn(): void {
    console.log('signIn');
    if (this.googleAuth) {
      this.googleAuth.signIn()
        .then(
        (googleUser) => this.handleSignIn(googleUser),
        (error) => console.log('Error while signing in',error));
    }
  }

  signOut(): void {
    console.log('signOut');
    if (this.tokenTimer) {
      this.tokenTimer.unsubscribe();
    }
    this.googleAuth.signOut();
  }

  handleSignIn(googleUser: gapi.auth2.GoogleUser) {
    if (googleUser.isSignedIn()) {
      this.googleUser = googleUser;
      this.isSignedInSubject.next(true);
      console.log('handleSignIn', googleUser);
      this.startTokenTimer(googleUser);
    }
  }

  startTokenTimer(googleUser: gapi.auth2.GoogleUser) {
    console.log('StartTokenTimer', googleUser.getAuthResponse().expires_in);
    let expires_in = googleUser.getAuthResponse().expires_in;
    this.tokenTimer = Observable.timer(expires_in * 1000)
      .timeInterval()
      .subscribe((resp) => this.handleTokenRefresh(resp));
  }

  handleTokenRefresh(response) {
    console.log('handleTokenRefresh Outer', response);
    this.googleUser.reloadAuthResponse()
      .then((authResponse: gapi.auth2.AuthResponse) => {
        console.log('handleTokenRefresh Inner', authResponse);
        this.tokenTimer.unsubscribe();
        this.refreshValues();
        this.startTokenTimer(this.googleUser);
      });
  }

  private isSignedIn() {
    console.log('isSignedIn', this.googleAuth && this.googleAuth.isSignedIn.get());
    return this.googleAuth && this.googleAuth.isSignedIn.get();
  }

  private loadScript() {
    let node = document.createElement('script');
    node.src = this.SCRIPT_URL;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
    window['onApiLoaded'] = this.handleClientLoad.bind(this);
  }

}
