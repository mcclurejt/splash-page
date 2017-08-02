import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GapiService } from "app/content-providers/google/gapi.service";
import { Subscription } from "rxjs/Rx";
import { GoogleMessageList } from "app/models/google-message-list";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import { EmailMessage } from "app/models/emailMessage";
import * as _ from "lodash";


@Injectable()
export class GmailService {

  private gapiSignedInSubscription: Subscription;
  private nextPageToken: string;


  constructor(private gapiService: GapiService) {
    
  }

  getEmails(): Observable<any> {
    console.log("getEmails()");
    return this.requestEmailIds()
    .map((response) => {
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
            resolve(response);
          });
        }));
  }

  getEmailsFromList(messageList): Observable<any> {
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

    let messageList: EmailMessage[] = [];
    for (let i = 0; i<messageIds.length; i++) {
      let message = response[messageIds[i].id].result;
      let email = this.mapGoogleMessageToEmailMessage(message);
      messageList.push(email);
    }
    return _.keyBy(messageList, 'id');
  }

  mapGoogleMessageToEmailMessage(gMessage: any): EmailMessage {
    let result: any = {
      id: gMessage.id,
      threadId: gMessage.threadId,
      labelIds: gMessage.labelIds
    };
    if (gMessage.internalDate) {
      result.internalDate = parseInt(gMessage.internalDate);
    }

    if (!gMessage.payload) {
      return new EmailMessage(result);
    }

    let headers = this.indexHeaders(gMessage.payload.headers);
    result.headers = headers;

    let parts = [gMessage.payload];
    let firstPartProcessed = false;

    while (parts.length !== 0) {
      let part = parts.shift();
      if (part.parts) {
        parts = parts.concat(part.parts);
      }
      if (firstPartProcessed) {
        headers = this.indexHeaders(part.headers);
      }

      let isHtml = part.mimeType && part.mimeType.indexOf('text/html') !== -1;
      let isPlain = part.mimeType && part.mimeType.indexOf('text/plain') !== -1;
      let isAttachment = headers['content-disposition'] && headers['content-disposition'].indexOf('attachment') !== -1;

      if (isHtml && !isAttachment) {
        result.textHtml = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/') );
      } else if (isPlain && !isAttachment) {
        result.textPlain = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      } else if (isAttachment) {
        var body = part.body;
        if (!result.attachments) {
          result.attachments = [];
        }
        result.attachments.push({
          filename: part.filename,
          mimeType: part.mimeType,
          size: body.size,
          attachmentId: body.attachmentId
        });
      }
      firstPartProcessed = true;
    }

    return new EmailMessage(result);
  }

  indexHeaders(headers: any): any {
    if (!headers) {
      return {};
    } else {
      return headers.reduce((result, header) => {
        result[header.name.toLowerCase()] = header.value;
        return result; 
       }, {});
    }
  }
}
