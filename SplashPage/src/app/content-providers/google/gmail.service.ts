import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GapiService } from "app/content-providers/google/gapi.service";
import { Subscription } from "rxjs/Rx";
import { GoogleMessageList } from "app/models/google-message-list";

@Injectable()
export class GmailService {

  private gapiSignedInSubscription: Subscription;
  private nextPageToken: string;


  constructor(private gapiService: GapiService) {
    this.gapiSignedInSubscription = this.gapiService.getIsSignedInStream()
    .subscribe((isSignedIn: boolean) => {
      if (isSignedIn) {
        console.log("Loading messages");
        this.getEmails();
      }
    });
  }

  getEmails(): Observable<any> {
    return this.getEmailMessagesList()
    .map((response) => { return new GoogleMessageList(response);
    }).flatMap((messageList: GoogleMessageList) =>
      this.getEmailsFromList(messageList)
     ).map((response) => this.mapMessages(response)
      );
  }

  getEmailMessagesList(): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
          gapi.client.request({
            path: 'https://www.googleapis.com/gmail/v1/users/me/messages',
            method: 'GET',
          }).then((response) => {
            resolve(response);
            console.log("here is the messages", response);
          });
        }));
  }

  getEmailsFromList(messageList: GoogleMessageList): Observable<any> {
    this.nextPageToken = messageList.nextPageToken;
    const messages = messageList.messages;
    let gapi = window['gapi'];
    let batch = gapi.client.newBatch();

    for (let i = 0; i < messages.length; i++) {
      let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + messages[i].id;
      let req = gapi.client.request({
        path: url,
        method: 'GET',
      });
      batch.add(req);
    }
    
    return Observable.fromPromise(new Promise((resolve) => {
      batch.execute((response) => {resolve(response); console.log("made it here too", response);});
    }));
  }

  mapMessages(any): string {
    return '';
  }
}
