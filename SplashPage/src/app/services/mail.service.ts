import { Injectable } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";
import { Store } from "@ngrx/store";
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';
import { Observable } from "rxjs/Observable";
import { MailMessage } from "app/store/mail/mail-message";
import { MailThread, MailMessageLookup } from "app/store/mail/mail.reducer";
import { MatDialog } from "@angular/material";
import { MailDetailDialogComponent } from "app/components/mail-detail-dialog/mail-detail-dialog.component";
import { MailSendDialogComponent } from "app/components/mail-send-dialog/mail-send-dialog.component";
import { Filter } from 'app/store/mail/mail.reducer';
import 'rxjs/add/observable/combineLatest';

import * as _ from 'lodash';

export interface Thread {
  messages: MailMessage[],
  threadId: string,
  internalDate: number
}

@Injectable()
export class MailService {
  private mailLoaded = false;
  public messages: Observable<MailMessage[]>;
  public threads: Observable<MailThread>;
  public messageLookup: Observable<MailMessageLookup>;
  public loading: Observable<boolean>;
  public unreadMessages: Observable<string[]>;
  public currentFilter: Observable<Filter>;
  public viewThreads: Observable<Thread[]>;

  constructor(public gmailService: GmailService, private store: Store<fromRoot.State>, public dialog: MatDialog, public dialogSend: MatDialog) {
    this.messages = this.store.select(store => store.mail.messages);
    this.threads = this.store.select(store => store.mail.threads);
    this.messageLookup = this.store.select(store => store.mail.messageLookup);
    this.loading = this.store.select(store => store.mail.loading);
    this.unreadMessages = this.store.select(store => store.mail.unreadMessages);
    this.currentFilter = this.store.select(store => store.mail.currentFilter)
    this.viewThreads = Observable.combineLatest(
      this.threads,
      this.currentFilter,
      this.unreadMessages,
      (threads,currentFilter,unreadMessages) => {
        let newThreads =  this.simpleInboxViewFilter(threads);
        return this.getFilteredMessages(newThreads, currentFilter, unreadMessages);
      }
    )
  }

  openDialog(message: MailMessage): void {
    console.log('Open Dialog');
    let dialogRef = this.dialog.open(MailDetailDialogComponent, {
      panelClass: 'mail-dialog-styling',
      data: {
        message: message,
      }
    });
    dialogRef.afterClosed()
    .withLatestFrom(this.threads)
    .subscribe((result) => {
      if (result[0] == null) {
        console.log('Dialog closed, no changes made');
        return;
      } else {
        console.log('TODO: do stuff after dialog closes Email');
        this.openSendDialog(result[0]);
        return;
      }
    });
  }

  openSendDialog(message: any = ''): void {
    let dialogRef = this.dialogSend.open(MailSendDialogComponent, {
      panelClass: 'mail-send-dialog-styling',
      data : {
        message: message,
        isReply: message !== ''
      }
    });
    dialogRef.afterClosed()
    .subscribe((result) => {
      if (result == null) {
        console.log('Dialog closed, no message sent');
        return;
      }
      let messageForm = result[1];
      if (result[0] === 'SEND') {
        console.log('messageBody', messageForm.message);
        this.gmailService.sendEmail({
          'To': messageForm.recipient,
          'Subject': messageForm.subject,
        }, messageForm.message);
      } else if (result[0] === 'REPLY') {
        console.log('Sending reply message');
        this.gmailService.sendEmail({
          'To': messageForm.recipient,
          'Subject': messageForm.subject,
          'In-Reply-To': messageForm.inReplyTo,
          'References': messageForm.inReplyTo
        }, messageForm.message, messageForm.threadId);
      }
    });
  }

  onScroll(){
    console.log('OnScroll');
    this.store.dispatch(new MailActions.LoadMoreMessages());
  }

  getFilteredMessages(threads: Thread[], filter: Filter, unreadMessages: string[]): Thread[]{
    switch (filter){
      case Filter.all:{
        return threads;
      }
      case Filter.inbox:{
        return _.filter(threads,  (thread) => thread.messages[0].labelIds.includes('INBOX'));
      }
      case Filter.unread:{
        return  _.filter(threads,  (thread) => !this.isRead(thread.messages[0],unreadMessages));
      }
      case Filter.personal:{
        return _.filter(threads,  (thread) => thread.messages[0].labelIds.includes('CATEGORY_PERSONAL'));
      }
      case Filter.promotions:{
        return _.filter(threads,  (thread) => thread.messages[0].labelIds.includes('CATEGORY_PERSONAL'));
      }
      case Filter.social:{
        return _.filter(threads,  (thread) => thread.messages[0].labelIds.includes('CATEGORY_SOCIAL'));
      }
      default:{
        return threads;
      }
    }
  }

  isRead(message: MailMessage,unreadMessages: string[]): boolean{
    if(unreadMessages.includes(message.id)){
      return false;
    }
    return true;
  }

  updateFilter(filter: Filter){
    this.store.dispatch(new MailActions.UpdateFilter(filter));
  }

  private simpleInboxViewFilter(mailThreadObj): Thread[] {
    let threadArray: Thread[] = [];
    // console.log(mailThreadObj);
    _.forIn(mailThreadObj, (value, key) => {
      let thread: Thread = {
        messages: value.sort(this.compareMessageInternalDates),
        threadId: key,
        internalDate: 0
      };
      thread.internalDate = thread.messages[0].internalDate;
      threadArray.push(thread);
    });
    // Now that we have access to the highest internalDate sort all the threads
    threadArray = threadArray.sort(this.compareThreadInternalDates);
    // console.log(threadArray);
    return threadArray;
  }

  private compareThreadInternalDates(thread1: Thread, thread2: Thread): number {
    if (thread1.internalDate > thread2.internalDate) {
      return -1;
    } else if (thread1.internalDate === thread2.internalDate) {
      return 0;
    }
    return 1;
  }

  private compareMessageInternalDates(message1: MailMessage, message2: MailMessage): number {
    if (message1.internalDate > message2.internalDate) {
      return -1;
    } else if (message1.internalDate === message2.internalDate) {
      return 0;
    }
    return 1;
  }

}
