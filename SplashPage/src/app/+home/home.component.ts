import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  isLoading = true;

  constructor(private authService: AuthService) { 
    this.authService.isSignedInStream.subscribe( (isSignedIn) => {
      if(this.isLoading){
        this.isLoading = isSignedIn;
      }
    });
  }

}
