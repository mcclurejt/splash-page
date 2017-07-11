import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';
import 'rxjs/add/observable/fromPromise';


@Injectable()
export class AuthService {

  API_KEY = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
  CLIENT_ID = '874945954684-krbb8l7db5e59kerl2o5kvum2hdv1uok.apps.googleusercontent.com';
  SCOPES = 'https://www.googleapis.com/auth/gmail.modify';

  constructor(private apiService: ApiService, ) {

  }

  signIn() {
    
  }


}
