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
    console.log("getEmails()");
    return this.getEmailMessagesList()
    .map((response) => { return response.result })
    .flatMap((messageList) => this.getEmailsFromList(messageList))
    .map((response) => this.mapMessages(response)).share();
  }

  getEmailMessagesList(): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
          gapi.client.request({
            path: 'https://www.googleapis.com/gmail/v1/users/me/messages',
            method: 'GET',
          }).then((response) => {
            console.log("getEmailMessagesList()", response);
            resolve(response);
          });
        }));
  }

  getEmailsFromList(messageList): Observable<any> {
    console.log("here is the messages", messageList.messages);
    this.nextPageToken = messageList.nextPageToken;
    const messages = messageList.messages;
    let gapi = window['gapi'];
    let batch = gapi.client.newBatch();
    let params = {
      format: "full"
    };

    for (let i = 0; i < messages.length; i++) {
      console.log("message id:", messages[i].id);
      let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + messages[i].id;
      let req = gapi.client.request({
        path: url,
        method: 'GET',
        params: params
      });
      batch.add(req);
    }
    
    return Observable.fromPromise(new Promise((resolve) => {
      batch.execute((response) => {
        console.log("made it here too", response);
        resolve(response); 
      });
    }));
  }

  mapMessages(any): string {
    return any;
  }
}
