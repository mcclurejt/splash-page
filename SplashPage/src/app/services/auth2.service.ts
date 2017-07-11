import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';
import 'rxjs/add/observable/fromPromise';


@Injectable()
export class Auth2Service {

  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify';

  private _googleAuth: gapi.auth2.GoogleAuth;
  private _scope = 'profile email https://www.googleapis.com/auth/youtube';
  private _accessToken: string;
  private isSignedInStream: Observable<boolean>;

  constructor(
    private zone: NgZone,
    private apiService: ApiService,
  ) {
    this.loadAuth();
  }

  loadAuth() {
    // attempt to SILENT authorize
    this.apiService
      .load('auth2')
      .switchMap(() => this.initGapi())
      .do((googleAuth: gapi.auth2.GoogleAuth) => this.saveGoogleAuth(googleAuth))
      .do((googleAuth: gapi.auth2.GoogleAuth) => this.listenToGoogleAuthSignIn(googleAuth))
      // .filter((googleAuth: gapi.auth2.GoogleAuth) => this.isSignedIn())
      // .filter((googleAuth: gapi.auth2.GoogleAuth) => this.hasAccessToken(googleAuth))
      .map((googleAuth: gapi.auth2.GoogleAuth) => googleAuth.currentUser.get())
      // .subscribe((googleUser: gapi.auth2.GoogleUser) => {
      //   this.zone.run(() => this.handleSuccessLogin(googleUser));
      // });
      .subscribe((googleUser: gapi.auth2.GoogleUser) => {
        this.zone.run(() => this.handleSuccessLogin(googleUser));
        this.isSignedInStream = new Observable(observer => {
          observer.next(_googleAuth.isSignedIn())
        })
      });
  }

  initGapi() {
    let initConfig = {
      discoveryDocs: this.DISCOVERY_DOCS,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES,
    }
    return Observable.fromPromise(window['gapi'].auth2.init(initConfig));
  }

  private saveGoogleAuth(googleAuth: gapi.auth2.GoogleAuth): gapi.auth2.GoogleAuth {
    this._googleAuth = googleAuth;
    return googleAuth;
  }

  private listenToGoogleAuthSignIn (googleAuth: gapi.auth2.GoogleAuth) {
    window['gapi']['auth2'].getAuthInstance().isSignedIn.listen(authState => {
      console.log('authState changed', authState);
    });
  }

  isSignedIn() {
    return this._googleAuth && this._googleAuth.isSignedIn.get();
  }

  signIn() {
    let signOptions: gapi.auth2.SigninOptions = {
      scope: this.SCOPES,
    };
    if (this._googleAuth) {
      Observable.fromPromise(this._googleAuth.signIn(signOptions))
        .subscribe((response: any) => this.handleSuccessLogin(response), error => this.handleFailedLogin(error));
    }
  }

  handleSuccessLogin(googleUser: gapi.auth2.GoogleUser) {
    const authResponse = googleUser.getAuthResponse();
    const token = authResponse.access_token;
    const profile = googleUser.getBasicProfile();
    console.log('Successful Login');
  }

  handleFailedLogin(response) {
    console.log('FAILED TO LOGIN:', response);
  }

  signOut() {
    console.log('Sign Out');
    return Observable.fromPromise(this._googleAuth.signOut())
  }



}
