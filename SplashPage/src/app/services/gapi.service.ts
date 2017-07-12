import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/observable/fromPromise';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class GapiService {

  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar';

  private googleAuth: gapi.auth2.GoogleAuth;
  private currentUser: gapi.auth2.GoogleUser;
  private accessToken: string;
  private idToken: string;

  private isSignedInSubject : BehaviorSubject<boolean>;

  public getAccessToken(): string {
    console.log('gapi.getAccessToken()');
    if (this.isSignedIn()) {
      return this.accessToken;
    } else {
      return null;
    }
  }

  public getIdToken(): string {
    console.log('gapi.getAccessToken()');
    if (this.isSignedIn()) {
      return this.idToken;
    } else {
      return null;
    }
  }

  constructor(private zone: NgZone, private router: Router) {
    this.isSignedInSubject = new BehaviorSubject<boolean>(this.isSignedIn())
    this.load()
      .switchMap(() => this.initApi())
      .do((googleAuth: gapi.auth2.GoogleAuth) => this.saveGoogleAuth(googleAuth))
      .do((googleAuth: gapi.auth2.GoogleAuth) => this.listenToGoogleAuthStream(googleAuth))
      .map((googleAuth: gapi.auth2.GoogleAuth) => googleAuth.currentUser.get())
      .subscribe((googleUser: gapi.auth2.GoogleUser) => {
        this.zone.run(() => this.handleSuccessLogin(googleUser));
        return googleUser.isSignedIn();
      })
  }

  load(): Subject<any> {
    console.log('gapi.load()');
    let apiSubject = new Subject();
    let gapi = window['gapi'];
    let isGapiLoaded = gapi && gapi.load;
    let onApiLoaded = () => this._loadHelper(apiSubject);
    if (isGapiLoaded) {
      onApiLoaded();
    } else {
      window['apiLoaded'] = onApiLoaded;
    }
    return apiSubject;
  }

  _loadHelper(subject) {
    console.log('gapi.loadHelper()');
    let gapi = window['gapi'];
    let gapiAuthLoaded = gapi && gapi.auth2 && gapi.auth2.getAuthInstance();
    if (gapiAuthLoaded && gapiAuthLoaded.currentUser) {
      return subject.next(gapiAuthLoaded);
    }
    gapi.load('client:auth2', response => subject.next(response));
  }

  initApi() {
    console.log('gapi.initApi()');
    let initConfig = {
      discoveryDocs: this.DISCOVERY_DOCS,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES,
    };
    return Observable.fromPromise(window['gapi'].auth2.init(initConfig));
  }

  saveGoogleAuth(googleAuth: gapi.auth2.GoogleAuth): gapi.auth2.GoogleAuth {
    console.log('gapi.saveGoogleAuth()');
    this.googleAuth = googleAuth;
    return googleAuth;
  }

  listenToGoogleAuthStream(googleAuth: gapi.auth2.GoogleAuth) {
    console.log('gapi.listenToGoogleAuthStream()');
    window['gapi']['auth2'].getAuthInstance().isSignedIn.listen(authState => {
      this.isSignedInSubject.next(authState);
    });
  }

  handleSuccessLogin(googleUser: gapi.auth2.GoogleUser) {
    console.log('gapi.handleSuccessLogin()');
    const authResponse = googleUser.getAuthResponse();
    this.accessToken = authResponse.access_token;
    this.idToken = authResponse.id_token;
    const profile = googleUser.getBasicProfile();
    this.isSignedInSubject.next(true);
    this.router.navigate(['/'])
  }

  handleFailedLogin(response) {
    console.log('gapi.handleFailedLogin()');
    return false;
  }

  signIn() {
    console.log('gapi.signIn()');
    let signOptions: gapi.auth2.SigninOptions = {
      scope: this.SCOPES,
    };
    if (this.googleAuth) {
      Observable.fromPromise(this.googleAuth.signIn(signOptions))
        .subscribe((response: any) => this.handleSuccessLogin(response), error => this.handleFailedLogin(error));
    }
  }

  signOut() {
    console.log('gapi.signOut()');
    this.router.navigate(['/signin'])
    this.googleAuth.signOut()
    this.isSignedInSubject.next(false);
  }

  private isSignedIn() {
    console.log('gapi.isSignedIn()');
    return this.googleAuth && this.googleAuth.isSignedIn.get();
  }

  public getIsSignedInObservable(): Observable<boolean>{
    console.log('gapi.getIsSignedInObservable()');
    return this.isSignedInSubject.asObservable().share();
  }

  // API METHODS

  getBatch(): gapi.client.HttpBatch {
    console.log('gapi.getBatch()');
    let batch: gapi.client.HttpBatch = window['gapi'].client.newBatch();
    return batch;
  }

  getRequest(params): gapi.client.HttpRequest<any> {
    console.log('gapi.getRequest()');
    return window['gapi'].client.request(params);
  }

}
