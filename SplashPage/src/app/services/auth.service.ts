import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GoogleService } from './google.service';
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
  public currentUserStream: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private router: Router, private googleService: GoogleService) {
    
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
        if(user) {
          return user.photoURL;
        }
        return '/assets/images/missing_photo.png';
      });

      this.currentUserStream = this.afAuth.authState;
  }

  signInWithGoogle() {
    let googleAuthProvider = new firebase.auth.GoogleAuthProvider()
    googleAuthProvider.addScope(this.googleService.GMAIL_SCOPE);
    googleAuthProvider.addScope(this.googleService.GCAL_SCOPE);
    this.afAuth.auth.signInWithPopup(googleAuthProvider)
      .then((result) => {
        // Initialize Google Api for Calendar and Email
        this.googleService.handleUserLogin(result);
        // Navigate to the naked domain
        this.router.navigate(['/']);
      })
      .catch((error) => this.handleFailedLogin(error))
  }

  handleFailedLogin(error) {
    console.log('Error when signing in', error);
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.googleService.signOut();
    this.router.navigate(['/signin'])
  }

}
