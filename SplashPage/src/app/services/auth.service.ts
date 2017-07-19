import { GapiService } from './../google/gapi.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {

  public isSignedInStream: Observable<boolean>;
  public displayNameStream: Observable<string>;
  public photoUrlStream: Observable<string>;

  constructor(private afAuth: AngularFireAuth, private router: Router, private gapiService: GapiService) {

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

    this.photoUrlStream = this.afAuth.authState
      .map<firebase.User, string>((user: firebase.User) => {
        if (user) {
          return user.photoURL;
        }
        return '/assets/images/missing_photo.png';
      });
  }

  signInWithGoogle() {
    this.gapiService.signIn()
      .then((user: gapi.auth2.GoogleUser) => {
        let idToken = user.getAuthResponse().id_token;
        let access_token = user.getAuthResponse().access_token;
        let cred = firebase.auth.GoogleAuthProvider.credential(idToken, access_token);
        this.afAuth.auth.signInWithCredential(cred).then((user) => {
          console.log('User Signed in to firebase:', user);
          this.router.navigate(['/']);
        });
      });
  }

  handleFailedLogin(error) {
    console.log('Error when signing in', error);
  }

  signOut() {
    this.gapiService.signOut()
    this.afAuth.auth.signOut()
      .then((resp) => {
        console.log('afAuthSignedOut');
        this.router.navigate(['/signin'])
      });
  }

}
