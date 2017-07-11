import { FireService } from './services/fire.service';
import { GapiService } from './services/gapi.service';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(db: AngularFireDatabase,
              public authService: AuthService,
              public gapiService: GapiService,
              public fireService: FireService) {}

}
