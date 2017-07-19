import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class GmailService {

  constructor() { }

  // Email API

  getEmailMessagesList(): Observable<any> {
   return Observable.fromPromise(new Promise((resolve, reject) => {
    gapi.client.request({
      path: 'https://www.googleapis.com/gmail/v1/me/messsages',
      method: 'GET',
    }).then((response) => { 
      resolve(response);
    });
   }));
  }

}
