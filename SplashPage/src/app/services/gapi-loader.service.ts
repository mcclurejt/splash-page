import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class GapiLoader {

  SCRIPT_URL = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar'

  private isLoadedSubject = new BehaviorSubject(this.isLoaded());
  googleAuth: gapi.auth2.GoogleAuth
  googleUser: gapi.auth2.GoogleUser

  constructor(private afAuth: AngularFireAuth) {
    this.loadScript();
    window['handleClientLoad'] = this.handleClientLoad.bind(this);
  }

  getLoadedStream():Observable<boolean>{
    return this.isLoadedSubject.asObservable().distinctUntilChanged().share();
  }

  handleClientLoad() {
    console.log('handleClientLoad');
    gapi.load('client:auth2', this.initClient.bind(this))
  }

  initClient() {
    console.log('initClient');
    gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: this.DISCOVERY_DOCS,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES
    }).then(this.setToken.bind(this));
  }

  setToken() {
    let gapi = window['gapi'];
    let access_token = localStorage.getItem('GoogleToken');
    gapi.client.setToken({ access_token: access_token });
    gapi.auth.setToken({ access_token: access_token });
    console.log('setToken');
    this.googleAuth = gapi.auth2.getAuthInstance();
    this.isLoadedSubject.next(true);
  }

  updateToken(access_token: string) {
    localStorage.setItem('GoogleToken', access_token);
    // if (this.isLoaded()) {
    //   this.setToken();
    // }
    this.setToken();
  }

  signOut() {
    this.googleAuth.signOut();
    this.isLoadedSubject.next(false);
    localStorage.removeItem['GoogleToken'];
  }

  private isLoaded() {
    let gapi = window['gapi']
    let isGapiLoaded = gapi && gapi.load;
    if (isGapiLoaded) {
      let isAuthLoaded = gapi && gapi.auth2 && gapi.auth2.getAuthInstance();
      if (isAuthLoaded && isAuthLoaded.isSignedIn.get()) {
        return true;
      }
    }
    return false;
  }

  private loadScript() {
    let node = document.createElement('script');
    node.src = this.SCRIPT_URL;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
