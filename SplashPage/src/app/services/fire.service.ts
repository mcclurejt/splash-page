import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GapiService } from './gapi.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class FireService {

  public isSignedInSubject: BehaviorSubject<boolean>;
  public displayNameStream: Observable<string>;

  constructor(private gapiService: GapiService, private afAuth: AngularFireAuth) {
    this.isSignedInSubject = new BehaviorSubject(this.isSignedIn())

    this.displayNameStream = this.afAuth.authState
      .map<firebase.User, string>((user: firebase.User) => {
        if (user) {
          console.log('Firebase User');
          return user.displayName;
        } else {
          console.log('No Firebase User');
        }
        return '';
      });

    this.gapiService.getIsSignedInObservable().subscribe((isSignedIn: boolean) => {
      if (!isSignedIn) {
        console.log('Signing out of firebase');
        this.signOut();
      } else {
        this.loadFirebaseAuth();
      }
    })


  }

  loadFirebaseAuth() {
    if (this.gapiService.getIdToken() && !this.isSignedInSubject.value) {
      this.isSignedInSubject.next(true);
      let credential = firebase.auth.GoogleAuthProvider.credential(this.gapiService.getIdToken());
      this.afAuth.auth.signInWithCredential(credential).then((resp) => {
        console.log('Firebase Auth Successful');
      });
    }
  }

  signOut() {
    console.log('Signed Out');
    this.afAuth.auth.signOut();
    this.isSignedInSubject.next(false);
  }

  private isSignedIn(): boolean{
    return this.afAuth.auth == null;
  }
}
