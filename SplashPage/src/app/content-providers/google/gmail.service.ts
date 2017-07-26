import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GapiService } from "app/content-providers/google/gapi.service";
import { Subscription } from "rxjs/Rx";

@Injectable()
export class GmailService {

  private gapiSignedInSubscription: Subscription;
  private nextPageToken: string;


  constructor(private gapiService: GapiService) {
    this.gapiSignedInSubscription = this.gapiService.getIsSignedInStream()
    .subscribe((isSignedIn: boolean) => {
      this.getEmailMessagesList();
    });
  }

  // getEmails(): Observable<any> {
  //   return this.getEmailMessagesList()
  //   .map((response) => {
  //     this.nextPageToken = response.result.nextPageToken;
  //     return response.result.messages;})
  //     .flatMap((result) => {
        
  //      })
  // }

  getEmailMessagesList(): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      this.gapiService.getIsSignedInStream().subscribe((isSignedIn) => {
        if (isSignedIn) {

          gapi.client.request({
            path: 'https://www.googleapis.com/gmail/v1/users/me/messages',
            method: 'GET',
          }).then((response) => {
            resolve(response);
            // console.log("here is the messages", response);
          });
        }
      });
    }));
  }

}
