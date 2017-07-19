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
export class GapiService {

  SCRIPT_URL = 'https://apis.google.com/js/api.js?onload=handleClientLoad';
  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest", "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar'

  isSignedInSubject = new BehaviorSubject<boolean>(false);

  getIsSignedInStream(): Observable<boolean> {
    return this.isSignedInSubject.asObservable().distinctUntilChanged().share();
  }

  constructor() {
    this.loadScript();
  }

  handleClientLoad(): void {
    console.log('handleClientLoad');
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  initClient() {
    console.log('initClient');
    gapi.client.init({
      'apiKey': this.API_KEY,
      'discoveryDocs': this.DISCOVERY_DOCS,
      'clientId' : this.CLIENT_ID,
      'scope' : this.SCOPES,
    }).then( () => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus.bind(this));
      this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  updateSignInStatus(isSignedIn){
    if(isSignedIn){
      console.log('UpdateSigninStatus: isSignedIn=true');
      this.isSignedInSubject.next(true);
    } else {
      console.log('UpdateSigninStatus: isSignedIn=false');
      this.isSignedInSubject.next(false);
    }
  }

  signIn(): Promise<gapi.auth2.GoogleUser>{
    console.log('Gapi SignIn');
    return gapi.auth2.getAuthInstance().signIn();
  }

  signOut(){
    console.log('Gapi SignOut');
    gapi.auth2.getAuthInstance().signOut();
  }

  private loadScript() {
    let node = document.createElement('script');
    node.src = this.SCRIPT_URL;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
    window['handleClientLoad'] = this.handleClientLoad.bind(this);
  }
}

