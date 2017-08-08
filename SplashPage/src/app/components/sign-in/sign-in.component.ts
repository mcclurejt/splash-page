import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

import { Store } from "@ngrx/store";
import * as AuthActions from 'app/store/auth/auth.actions';
import * as fromRoot from 'app/store/reducers';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  google = 'google';

  constructor(private store: Store<fromRoot.State>,public authService: AuthService) { }

  ngOnInit() {
  }

  signIn(provider: string){
    console.log('Signing in with: ',provider);
    this.store.dispatch(new AuthActions.SignIn(provider));
  }

}
