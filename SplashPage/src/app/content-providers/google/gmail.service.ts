import { MailThread } from './../../store/mail/mail.reducer';
import { MailMessage } from './../../store/mail/mail-message';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GapiService } from "app/content-providers/google/gapi.service";
import { Subscription } from "rxjs/Rx";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import * as _ from "lodash";
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';
import base64url from "base64url";

import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class GmailService {

  private gapiSignedInSubscription: Subscription;
  private nextPageToken: string;


  constructor(private gapiService: GapiService, private store: Store<fromRoot.State>) { }

  sendEmail(headers: any, message: string, threadId: string = ''): void {
    let email = '';

    for (let header in headers) {
      email += header += ': ' + headers[header] + '\r\n';
    }

    email += '\r\n' + message;
    console.log(email);
    this.sendRequest(email, threadId)
      .map((response) => this.mapGoogleMessageToEmailMessage(response))
      .subscribe((message: MailMessage) => {
        console.log("Sent Mail Message Returned?", message);
      });
  }

  sendRequest(email: string, threadId: string = ''): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      this.gapiService.getIsSignedInStream().subscribe((isSignedIn) => {
        if (isSignedIn) {
          const params = {
            userId: 'me',
          }
          let body = {};
          if (threadId !== '') {
            body = {
              // raw: btoa(encodeURIComponent(email)).replace(/\+/g, '-').replace(/\//g, '_')
              raw: base64url.encode(email, 'utf8').replace(/\+/g, '-').replace(/\//g, '_'),
              threadId: threadId
            }
          } else {
            body = {
              // raw: btoa(encodeURIComponent(email)).replace(/\+/g, '-').replace(/\//g, '_')
              raw: base64url.encode(email, 'utf8').replace(/\+/g, '-').replace(/\//g, '_')
            }
          }

          gapi.client.request({
            path: 'https://www.googleapis.com/gmail/v1/users/userId/messages/send',
            method: 'POST',
            params: params,
            body: body
          }).then((response) => {
            resolve(response);
          });
        }
      });
    }));
  }

  getEmailIds(): Observable<any> {
    return this.requestEmailIds()
      .map((response) => this.mapEmailIds(response.result))
  }

  getEmails(messageIds: any): Observable<MailMessage[]> {
    return this.requestEmails(messageIds)
      .map((messageResp) => this.mapEmails(messageResp))
  }

  getFullEmail(messageId: string): Observable<MailMessage> {
    return this.requestFullMessage(messageId)
      .map((message) => message.result)
      .map((messageResp) => this.mapGoogleMessageToEmailMessage(messageResp))
  }

  getFullThread(message: MailMessage, threads: MailThread): Observable<MailMessage[]> {
    return this.requestFullThread(message, threads)
      .map((messageResp) => this.mapFullEmails(messageResp))
  }

  markRead(message: MailMessage): Observable<MailMessage> {
    let body = {
      "removeLabelIds": [
        'UNREAD',
      ]
    }
    return Observable.fromPromise(gapi.client.request({
      path: 'https://www.googleapis.com/gmail/v1/users/me/messages/' + message.id + '/modify',
      method: 'POST',
      body: body
    }))
      .map((resp) => resp.result)
      .map((messageResp) => this.mapGoogleMessageToEmailMessage(messageResp))
  }

  private requestEmailIds(): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      this.gapiService.getIsSignedInStream().subscribe((isSignedIn) => {
        if (isSignedIn) {
          let params;
          this.nextPageToken != null ? params = { pageToken: this.nextPageToken } : params = {};
          gapi.client.request({
            path: 'https://www.googleapis.com/gmail/v1/users/me/messages',
            method: 'GET',
            params: params,
          }).then((response) => {
            resolve(response);
          });
        }
      });
    }));
  }

  private requestEmails(messages): Observable<any> {
    let gapi = window['gapi'];
    let params = {
      format: "metadata"
    };
    let batch = gapi.client.newBatch();
    for (let message of messages) {
      let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + message.id;
      let req = gapi.client.request({
        path: url,
        method: 'GET',
        params: params
      });
      batch.add(req, { 'id': message.id });
    }
    return Observable.fromPromise(new Promise((resolve, reject) => {
      batch.execute((response) => {
        resolve(response);
      });
    })
    );
  }

  private requestFullMessage(messageId: string): Observable<any> {
    let params = {
      format: 'full',
    };
    let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + messageId;
    let req = gapi.client.request({
      path: url,
      method: 'GET',
      params: params,
    });
    return Observable.fromPromise(req);
  }

  private mapEmailIds(messageList): Array<any> {
    this.nextPageToken = messageList.nextPageToken;
    const messages = messageList.messages;
    return messages;
  }

  private requestFullThread(message: MailMessage, threads: MailThread): Observable<any> {
    let gapi = window['gapi'];
    let params = {
      format: 'full',
    };
    let batch = gapi.client.newBatch();
    let thread = threads[message.threadId];
    for (let threadMsg of thread) {
      if (threadMsg.id != message.id) {
        let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + threadMsg.id;
        let req = gapi.client.request({
          path: url,
          method: 'GET',
          params: params
        });
        batch.add(req, { 'id': threadMsg.id });
      }
    }
    return Observable.fromPromise(new Promise((resolve, reject) => {
      batch.execute((response) => {
        resolve(response);
      });
    })
    );
  }

  private mapFullEmails(mailResp): MailMessage[] {
    let messages = [];
    for (let key of _.keys(mailResp)) {
      let message = mailResp[key].result;
      let mailMessage = this.mapGoogleMessageToEmailMessage(message);
      messages.push(mailMessage);
    }
    // console.log('mailResp mapped', messages);
    return messages;
  }

  private mapEmails(mailResp): MailMessage[] {
    // console.log('mailResp', mailResp);
    let messages = [];
    for (let key of _.keys(mailResp)) {
      let message = mailResp[key].result;
      let mailMessage = this.mapPartialGoogleMessageToEmailMessage(message);
      messages.push(mailMessage);
    }
    // console.log('mailResp mapped', messages);
    return messages;
  }

  private mapGoogleMessageToEmailMessage(gMessage: any): MailMessage {
    // console.log("gMessage: ", gMessage);
    let result: any = {
      id: gMessage.id,
      threadId: gMessage.threadId,
      labelIds: gMessage.labelIds,
      snippet: gMessage.snippet
    };
    if (gMessage.internalDate) {
      result.internalDate = parseInt(gMessage.internalDate);
    }

    if (!gMessage.payload) {
      return new MailMessage(result);
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
        // result.textHtml = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/') );
        // result.textHtml = this.b64DecodeUnicode(part.body.data);
        result.textHtml = this.b64DecodeUtf8(part.body.data);
      } else if (isPlain && !isAttachment) {
        // result.textPlain = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        // result.textPlain = this.b64DecodeUnicode(part.body.data);
        result.textPlain = this.b64DecodeUtf8(part.body.data);
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

    return new MailMessage(result);
  }

  private mapPartialGoogleMessageToEmailMessage(googleMessage: any): MailMessage {
    let message = new MailMessage(googleMessage);
    message.headers = this.indexHeaders(googleMessage.payload.headers);
    return message;
  }

  private indexHeaders(headers: any): any {
    if (!headers) {
      return {};
    } else {
      return headers.reduce((result, header) => {
        result[header.name.toLowerCase()] = header.value;
        return result;
      }, {});
    }
  }

  private b64DecodeUnicode(str: any) {
    // return decodeURIComponent(Array.prototype.map.call(atob(str.replace(/-/g, '+').replace(/_/g, '/')), (c) => {
    //   return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));
    return decodeURIComponent(encodeURIComponent(atob(str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''))));
  }

  private b64DecodeUtf8(str: any) {
    return base64url.decode(str, 'utf8');
  }
}
