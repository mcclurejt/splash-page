import { GapiService } from './gapi.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class FireService {

  public isSignedInStream: Observable<boolean>;
  public displayNameStream: Observable<string>;

  constructor(private gapiService: GapiService, private afAuth: AngularFireAuth) {
    this.isSignedInStream = this.afAuth.authState
      .map<firebase.User, boolean>((user: firebase.User) => {
        return user != null;
      });

    this.displayNameStream = this.afAuth.authState
      .map<firebase.User, string>((user: firebase.User) => {
        if (user) {
          return user.displayName;
        }
        return '';
      });
  }

  loadFirebaseAuth() {
    if (this.gapiService.getIdToken()) {
      let credential = firebase.auth.GoogleAuthProvider.credential(this.gapiService.getIdToken());
      this.afAuth.auth.signInWithCredential(credential).then((resp) => {
        console.log('Firebase Auth Successful');
      });
    }
  }

}
