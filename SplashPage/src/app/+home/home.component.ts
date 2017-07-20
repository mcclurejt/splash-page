import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  isLoading = false;

  constructor(private authService: AuthService) { }

  signInWithGoogle(){
    this.isLoading = true;
    this.authService.signInWithGoogle();
    // Get rid of the loading component when signed in
    this.authService.isSignedInStream.subscribe( (isSignedIn) => {
      if(isSignedIn){
        this.isLoading = false;
      }
    });
  }

}
