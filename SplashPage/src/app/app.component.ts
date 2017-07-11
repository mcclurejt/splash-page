import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(db: AngularFireDatabase, public authService: AuthService, public apiService: ApiService) {

  }

}
