
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase/app';

@Injectable()
export class FireService {

  constructor(private afAuth: AngularFireAuth) {
    // Going to be a service for handling firebase database info
  }

}
