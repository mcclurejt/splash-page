import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as AuthActions from 'app/store/auth/auth.actions';
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as fromRoot from 'app/store/reducers';
import * as firebase from 'firebase/app';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthEffects {

  constructor(private authService: AuthService, private actions: Actions, private router: Router, public store: Store<fromRoot.State>) { }


  @Effect() signIn: Observable<AuthActions.All> = this.actions.ofType(AuthActions.SIGNIN)
    .map(toPayload)
    .switchMap((provider: string) => {
      return this.authService.signInWithProvider(provider)
      // Handle if user closes sign-in tab
        .catch((error) => {
          console.log('Error signing in: ', error);
          return Observable.of(null)
        })
    })
    .map((user: firebase.User) => {
      if (user) {
        console.log('Signed In');
        this.router.navigate(['/']);
      }
      return new AuthActions.StopLoading();
    });

  @Effect() signOut: Observable<AuthActions.All> = this.actions.ofType(AuthActions.SIGNOUT)
    .map((action) => {
      this.authService.handleSignOut();
      return new AuthActions.StopLoading();
    });

}