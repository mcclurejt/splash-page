import { MailMessageLookup } from 'app/store/mail/mail.reducer';
import { toPayload } from '@ngrx/effects';
import { MailMessage } from './mail-message';
import { GmailService } from './../../content-providers/google/gmail.service';
import { MailService } from './../../services/mail.service';
import { Observable } from 'rxjs/Observable';
import { Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class MailEffects{

  constructor(private actions: Actions, private store: Store<fromRoot.State>, public mailService: MailService, private gmailService: GmailService){}

  @Effect() onStateChange: Observable<MailActions.All> = this.actions.ofType(MailActions.ON_STATE_CHANGE)
    .do(() => this.store.dispatch(new MailActions.StartLoading()))
    .switchMap(() => this.gmailService.getEmailIds())
    .switchMap((messageIds: any) => this.gmailService.getEmails(messageIds))
    .map((messages) => {
      this.store.dispatch(new MailActions.HandleMailAdd(messages))
      return new MailActions.StopLoading();
    });

  @Effect() openDetailDialog: Observable<MailActions.All> = this.actions.ofType(MailActions.OPEN_DETAIL_DIALOG)
    .map(toPayload)
    .do(() => this.store.dispatch(new MailActions.StartLoading()))
    .withLatestFrom(this.mailService.messageLookup)
    .map(([message, messageLookup]) => {
      if(messageLookup[message.id]){
        console.log('MessageLookup',messageLookup[message.id]);
        this.mailService.openDialog(messageLookup[message.id]);
      } else {
        this.store.dispatch(new MailActions.FullMessageAdd(message.id))
      }
      return new MailActions.StopLoading();
    });
    
    
  @Effect() addFullMessage: Observable<MailActions.All> = this.actions.ofType(MailActions.FULL_MESSAGE_ADD)
    .map(toPayload)
    .do(() => this.store.dispatch(new MailActions.StartLoading()))
    .switchMap((messageId: string) => this.gmailService.getFullEmail(messageId))
    .map((message: MailMessage) => {
      this.store.dispatch(new MailActions.HandleFullMessageAdd(message));
      this.mailService.openDialog(message);
      return new MailActions.StopLoading();
    });

}