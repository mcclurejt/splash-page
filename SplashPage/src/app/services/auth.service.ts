import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AsyncSubject } from "rxjs/AsyncSubject";

declare var gapi: any;

@Injectable()
export class AuthService {


  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify';
  
  isSignedInStream: BehaviorSubject<boolean>;

  constructor(private router: Router) {
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  initClient(): void {
    console.log('Init Client Reached');
    let initConfig = {
      discoveryDocs: this.DISCOVERY_DOCS,
      clientId: this.CLIENT_ID,
      scope: this.SCOPES,
    }
    gapi.client.init(initConfig).then(() => {
      // // Listen for state changes
      // gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
      //   console.log('Auth State:', isSignedIn);
      //   this.updateSignInStatus(isSignedIn);
      // });
      this.isSignedInStream = new BehaviorSubject(gapi.auth2.getAuthInstance().isSignedIn)
      gapi.auth2.getAuthInstance().isSignedIn
        .listen(isSignedIn => {
          console.log('Auth State:', isSignedIn);
          this.updateSignInStatus(isSignedIn);
        });

      // Handle initial sign-in state.
      this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  updateSignInStatus(isSignedIn: boolean): void {
    this.isSignedInStream.next(isSignedIn);
    if (isSignedIn) {
      console.log('Authenticated');
    } else {
      console.log('Not Authenticated');
    }
  }

  signIn(): void {
    gapi.auth2.getAuthInstance().signIn().then( () => {
      console.log('Signed In');
      this.router.navigate(['/']);
    })
  }

  signOut(): void {
    gapi.auth2.getAuthInstance().signOut().then( () => {
      this.router.navigate(['/signin']);
    });
    console.log('Signed Out');
  }

}
