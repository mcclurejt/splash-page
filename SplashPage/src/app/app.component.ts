import { Component } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { AuthService } from "app/services/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
