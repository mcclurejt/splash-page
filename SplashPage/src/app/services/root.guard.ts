import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RootGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isSignedInStream.map<boolean, boolean>((isSignedIn: boolean) => {
      if (!isSignedIn) {
        this.router.navigate(['/signin']);
      }
      return isSignedIn;
    });
  }
}
