import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GapiService } from "app/content-providers/google/gapi.service";
import { Subscription } from "rxjs/Rx";
import { GoogleMessageList } from "app/models/google-message-list";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import { GoogleMessage } from "app/models/google-message";

@Injectable()
export class GmailService {

  private gapiSignedInSubscription: Subscription;
  private nextPageToken: string;
  private messageMap: Map<string, GoogleMessage>;


  constructor(private gapiService: GapiService) {
    
  }

  getEmails(): Observable<any> {
    console.log("getEmails()");
    return this.requestEmailIds()
    .map((response) => {
      console.log('Email Response',response);
      return response.result })
    .flatMap((messageList) => this.getEmailsFromList(messageList))
    .map((response) => this.mapMessages(response)).share();
  }

  requestEmailIds(): Observable<any> {
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
    console.log("getEmailsFromList()");
    this.nextPageToken = messageList.nextPageToken;
    const messages = messageList.messages;
    let gapi = window['gapi'];
    let batch = gapi.client.newBatch();
    let params = {
      format: "full"
    };
    for (let i = 0; i < messages.length; i++) {
      
      let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + messages[i].id;
      let req = gapi.client.request({
        path: url,
        method: 'GET',
        params: params
      });
      batch.add(req, {id: messages[i].id});
    }
    
    return Observable.fromPromise(new Promise((resolve) => {
      batch.execute((response, other) => {
        resolve([response, messages]); 
      });
    }));
  }

  mapMessages(any): any {
    let response = any[0];
    let messageIds = any[1];

    let messageList: GoogleMessage[] = [];
    // for (let i = 0; i<messageIds.length; i++) {
    //   let message = response[messageIds[i].id].result;
    //   let gMessage = Object.setPrototypeOf(message, GoogleMessage.prototype);
    //   this.messageMap.set(messageIds[i].id, gMessage);

    // }
    return response;
  }
}
