import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class GapiService {

  private api: Subject<any>;

  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar';

  private googleAuth: gapi.auth2.GoogleAuth;
  private currentUser: gapi.auth2.GoogleUser;
  private accessToken: string;
  private idToken: string;

  public getAccessToken(): string{
    if(this.isSignedIn()){
      return this.accessToken;
    } else {
      return null;
    }
  }

  public getIdToken(): string{
    if(this.isSignedIn()){
      return this.idToken;
    } else{
      return null;
    }
  }

  constructor(private zone: NgZone, private router: Router) {
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

  load(): Subject<boolean> {
    console.log('load');
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
    console.log('loadHelper');
    let gapi = window['gapi'];
    let gapiAuthLoaded = gapi && gapi.auth2 && gapi.auth2.getAuthInstance();
    if (gapiAuthLoaded && gapiAuthLoaded.currentUser) {
      return subject.next(gapiAuthLoaded);
    }
    gapi.load('auth2', response => subject.next(response));
  }

  initApi() {
    console.log('initApi');
    let initConfig = {
      discoveryDocs: this.DISCOVERY_DOCS,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES,
    };
    return Observable.fromPromise(window['gapi'].auth2.init(initConfig));
  }

  saveGoogleAuth(googleAuth: gapi.auth2.GoogleAuth): gapi.auth2.GoogleAuth {
    console.log('saveGoogleAuth');
    this.googleAuth = googleAuth;
    return googleAuth;
  }

  listenToGoogleAuthStream(googleAuth: gapi.auth2.GoogleAuth) {
    window['gapi']['auth2'].getAuthInstance().isSignedIn.listen(authState => {
      console.log('authState changed', authState);
    });
  }

  handleSuccessLogin(googleUser: gapi.auth2.GoogleUser) {
    console.log('handleSuccessLogin');
    const authResponse = googleUser.getAuthResponse();
    this.accessToken = authResponse.access_token;
    this.idToken = authResponse.id_token;
    const profile = googleUser.getBasicProfile();
    this.router.navigate(['/'])
  }

  handleFailedLogin(response) {
    console.log('FAILED TO LOGIN:', response);
    return false;
  }

  signIn() {
    console.log('Signin');
    let signOptions: gapi.auth2.SigninOptions = {
      scope: this.SCOPES,
    };
    if (this.googleAuth) {
      Observable.fromPromise(this.googleAuth.signIn(signOptions))
        .subscribe((response: any) => this.handleSuccessLogin(response), error => this.handleFailedLogin(error));
    }
  }

  signOut() {
    console.log('Sign Out');
    this.router.navigate(['/signin'])
    return Observable.fromPromise(this.googleAuth.signOut());
  }

  isSignedIn() {
    // console.log('isSignedIn', this.googleAuth && this.googleAuth.isSignedIn.get());
    return this.googleAuth && this.googleAuth.isSignedIn.get();
  }

  public getCalendarList() {
    if(this.isSignedIn()){
      let calparams = {
        maxResults: 10,
        showHidden: true,
      }
      return gapi.client.calendar.calendarList.list(calparams);
    }
  }

}
