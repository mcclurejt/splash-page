import { Subscription } from 'rxjs/Rx';
import { GapiService } from './../google/gapi.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnDestroy{

  private showLoading=false;
  private showLoadingSubscription: Subscription;

  constructor(private authService: AuthService) { }

  googleSignInClick(){
    this.authService.signInWithGoogle();
    this.showLoading = true;
    this.showLoadingSubscription = this.authService.isSignedInStream.subscribe( (isSignedIn) => {
      if(isSignedIn){
        this.showLoading = false;
      };
    });
  }

  ngOnDestroy(){
    this.showLoadingSubscription.unsubscribe();
  }

}
