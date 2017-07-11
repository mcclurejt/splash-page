import { FireService } from './fire.service';
import { Subscription } from 'rxjs/Subscription';
import { GapiService } from './gapi.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Injectable} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {

  

  constructor(private gapiService: GapiService, private fireService: FireService) {
  }

  


}
