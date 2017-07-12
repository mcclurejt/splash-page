import { FireService } from './fire.service';
import { GapiService } from './gapi.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
  isSignedInObservable: Observable<boolean>;

  constructor(private router: Router,
              private gapiService: GapiService,
              private authService: AuthService,
              private fireService: FireService){
                this.isSignedInObservable = this.gapiService.getIsSignedInObservable();
              }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isSignedInObservable.map<boolean, boolean>( (isSignedIn: boolean) => {
      if(!isSignedIn){
        this.router.navigate(['/signin'])
      } else {
        if(!this.fireService.isSignedInSubject.value){
          console.log('AuthGuard getValue');
          this.fireService.loadFirebaseAuth();
        }
      }
      return isSignedIn;
    });
  }
}
