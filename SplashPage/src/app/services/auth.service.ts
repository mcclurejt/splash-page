import { GapiService } from '../content-providers/google/gapi.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';
import { Store } from "@ngrx/store";
import * as AuthActions from 'app/store/auth/auth.actions';
import * as CalendarActions from 'app/store/calendar/calendar.actions'
import * as MailActions from 'app/store/mail/mail.actions'
import * as fromRoot from 'app/store/reducers';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class AuthService {

  public currentUser: Observable<firebase.User>;
  public isSignedIn: Observable<boolean>;
  public isLoading: Observable<boolean>;
  public displayName: Observable<string>;

  constructor(private afAuth: AngularFireAuth, private router: Router, private gapiService: GapiService, private store: Store<fromRoot.State>) {
    this.currentUser = this.store.select(state => state.auth.currentUser);
    this.isSignedIn = this.store.select(state => state.auth.isSignedIn);
    this.isLoading = this.store.select(state => state.auth.loading);
    this.displayName = this.currentUser.map(user => {
      if (user) {
        return user.displayName;
      }
      return '';
    });
    this.afAuth.authState.distinctUntilChanged().subscribe((user) => {
      this.store.dispatch(new AuthActions.StateChange(user));
    });
  }

  signInWithProvider(provider: string): Observable<firebase.User> {
    switch (provider) {
      case ('google'): {
        return this.signInWithGoogle();
      }
      default: {
        return null;
      }
    }
  }

  signInWithGoogle(): Observable<firebase.User> {
    return Observable.fromPromise(this.gapiService.signIn())
      .switchMap((user: gapi.auth2.GoogleUser) => {
        let idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
        let access_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        let timeInSeconds = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().expires_in;
        this.gapiService.startTokenTimer(access_token, timeInSeconds);
        let cred = firebase.auth.GoogleAuthProvider.credential(idToken, access_token);
        return Observable.fromPromise(this.afAuth.auth.signInWithCredential(cred));
      })
  }

  handleFailedLogin(error) {
    console.log('Error when signing in', error);
  }

  handleSignOut() {
    this.gapiService.signOut();
    this.afAuth.auth.signOut();
    this.store.dispatch(new CalendarActions.CalendarClearAll());
    this.store.dispatch(new MailActions.ClearAll());
    this.router.navigate(['/']);
  }

}
