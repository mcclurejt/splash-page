import { Injectable } from '@angular/core';
declare var gapi;

@Injectable()
export class AuthService {


  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify';

  constructor() {
    gapi.load('client:auth2', this.initClient)
  }

  initClient(): void {
    console.log('Init Client');
    gapi.client.init({
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
      clientId: '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok',
      scope: 'https://www.googleapis.com/auth/gmail.readonly'
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
        // Handle the initial sign-in state.
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          console.log('Signed In');
        } else {
          console.log('Not Signed In');
        }
      });


      console.log('update sign in');
    });
  }

  updateSigninStatus(isSignedIn: boolean) {
    if (isSignedIn) {
      console.log('Signed In');
    } else {

    }
  }

  public signIn(): void {
    if (gapi.auth2)
      gapi.auth2.getAuthInstance().signIn();
  }

  signOut(): void {
    gapi.auth2.getAuthInstance().signOut();
  }

}
