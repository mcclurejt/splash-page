import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import * as AuthActions from 'app/store/auth/auth.actions';
import * as fromRoot from 'app/store/reducers';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(public authService: AuthService, public store: Store<fromRoot.State>) { }

  signOut(){
    this.store.dispatch(new AuthActions.SignOut());
  }

}
