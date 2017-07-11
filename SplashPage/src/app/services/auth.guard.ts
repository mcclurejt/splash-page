import { FireService } from './fire.service';
import { GapiService } from './gapi.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private gapiService: GapiService,
              private authService: AuthService,
              private fireService: FireService){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.gapiService.isSignedIn()){
      this.router.navigate(['/signin'])
    } else {
      this.fireService.isSignedInStream.subscribe((isSignedIn: boolean) => {
        if(!isSignedIn){
          this.fireService.loadFirebaseAuth();
        }
      });
    }
    return this.gapiService.isSignedIn();
  }
}
