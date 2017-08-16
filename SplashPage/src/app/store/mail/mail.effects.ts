import { MailThread } from 'app/store/mail/mail.reducer';
import { MailMessageLookup } from 'app/store/mail/mail.reducer';
import { toPayload } from '@ngrx/effects';
import { MailMessage } from './mail-message';
import { GmailService } from './../../content-providers/google/gmail.service';
import { MailService } from './../../services/mail.service';
import { Observable } from 'rxjs/Observable';
import { Effect } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class MailEffects {

  constructor(private actions: Actions, private store: Store<fromRoot.State>, public mailService: MailService, private gmailService: GmailService) { }

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
    .withLatestFrom(this.mailService.messageLookup)
    .switchMap(([message, messageLookup]) => {
      let actions = [];
      if (messageLookup[message.id]) {
        this.mailService.openDialog(messageLookup[message.id]);
      } else {
        // Load the full initial message first, then load the full message for each message in the thread (if there are any more)
        actions.push(new MailActions.FullMessageAdd(message.id));
        if (message.labelIds.includes('UNREAD')) {
          actions.push(new MailActions.MarkRead(message));
        }
        actions.push(new MailActions.FullThreadAdd(message));
      }
      actions.push(new MailActions.StopLoading());
      return actions;
    });


  @Effect({dispatch: false}) addFullMessage: Observable<MailActions.All> = this.actions.ofType(MailActions.FULL_MESSAGE_ADD)
    .map(toPayload)
    .switchMap((messageId: string) => this.gmailService.getFullEmail(messageId))
    .map((message: MailMessage) => {
      this.store.dispatch(new MailActions.HandleFullMessageAdd(message));
      this.mailService.openDialog(message);
      return null;
    });

  @Effect() addFullThread: Observable<MailActions.All> = this.actions.ofType(MailActions.FULL_THREAD_ADD)
    .do(() => { console.log(MailActions.FULL_THREAD_ADD); })
    .map(toPayload)
    .withLatestFrom(this.mailService.threads)
    .switchMap(([message, threads]) => {
      if (threads[message.threadId].length > 1) {
        return this.gmailService.getFullThread(message, threads);
      }
      return Observable.of([]);
    })
    .map((messages) => {
      if (messages != []) {
        return new MailActions.HandleFullMessageAdd(messages);
      }
      return new MailActions.StopLoading();
    });

  @Effect() loadMoreMessages: Observable<MailActions.All> = this.actions.ofType(MailActions.LOAD_MORE_MESSAGES)
    .switchMap(() => this.gmailService.getEmailIds())
    .switchMap((messageIds: any) => this.gmailService.getEmails(messageIds))
    .map((messages) => new MailActions.HandleMailAdd(messages));

  @Effect() markRead: Observable<MailActions.All> = this.actions.ofType(MailActions.MARK_READ)
    .map(toPayload)
    .switchMap((message) => this.gmailService.markRead(message))
    .map((message) => new MailActions.HandleMarkRead(message))

}