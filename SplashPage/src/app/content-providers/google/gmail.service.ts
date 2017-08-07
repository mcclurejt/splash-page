import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GapiService } from "app/content-providers/google/gapi.service";
import { Subscription } from "rxjs/Rx";
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import { MailMessage } from "app/store/mail/mail-message";
import * as _ from "lodash";
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';



@Injectable()
export class GmailService {

  private gapiSignedInSubscription: Subscription;
  private nextPageToken: string;


  constructor(private gapiService: GapiService, private store: Store<fromRoot.State>) {}

  //TODO: consider adding a query parameter
  loadEmails(): void {
    console.log('Loading Emails');
    this.requestEmailIds()
      .flatMap((response) => this.mapEmailIds(response.result))
      .flatMap((messageId) => this.requestEmail(messageId))
      .map((messageResp) => this.mapEmail(messageResp))
      .subscribe((message) => {
        this.store.dispatch(new MailActions.MailAdd(message));
      });
  }

  requestEmailIds(): Observable<any> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      this.gapiService.getIsSignedInStream().subscribe((isSignedIn) => {
        if (isSignedIn) {
          gapi.client.request({
            path: 'https://www.googleapis.com/gmail/v1/users/me/messages',
            method: 'GET',
          }).then((response) => {
            resolve(response);
          });
        }
      });
    }));
  }

  mapEmailIds(messageList): Array<any> {
    this.nextPageToken = messageList.nextPageToken;
    const messages = messageList.messages;
    return messages;
  }

  requestEmail(message): Observable<any> {
    let params = {
      format: "full"
    };
    let url = 'https://www.googleapis.com/gmail/v1/users/me/messages/' + message.id;
    let req = gapi.client.request({
      path: url,
      method: 'GET',
      params: params
    });
    return Observable.fromPromise(req);
  }

  mapEmail(mailResp): MailMessage {
    let message = mailResp.result;
    let email = this.mapGoogleMessageToEmailMessage(message);
    return email;
  }

  mapGoogleMessageToEmailMessage(gMessage: any): MailMessage {
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
        result.textHtml = this.b64DecodeUnicode(part.body.data);
      } else if (isPlain && !isAttachment) {
        // result.textPlain = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        result.textPlain = this.b64DecodeUnicode(part.body.data);
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

  b64DecodeUnicode(str: any) {
    return decodeURIComponent(Array.prototype.map.call(atob(str.replace(/-/g, '+').replace(/_/g, '/')), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
