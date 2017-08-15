import { Component, OnInit, Input, Output } from '@angular/core';
import { MailService } from "app/services/mail.service";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { MailMessage } from "app/store/mail/mail-message";
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';

export const Filters = {
  all : 'ALL',
  inbox: 'INBOX',
  unread: 'UNREAD',
  personal: 'PERSONAL',
  social: 'SOCIAL',
  promotions: 'PROMOTIONS',
}

export interface Thread {
  messages: MailMessage[],
  threadId: string,
  internalDate: number
}

@Component({
  selector: 'app-mail-simple-inbox-view',
  templateUrl: './mail-simple-inbox-view.component.html',
  styleUrls: ['./mail-simple-inbox-view.component.scss']
})
export class MailSimpleInboxViewComponent implements OnInit {

  private _filter;
  public unfilteredThreads: Thread[];
  public threads: Thread[];
  public unreadMessages: string[];

  constructor(private mailService: MailService, private store: Store<fromRoot.State>,) { }

  ngOnInit() {
    this.mailService.threads
    .map(threads => this.simpleInboxViewFilter(threads))
    .subscribe(threads => {
      this.unfilteredThreads = threads;
      this.threads = threads;
    });
    this.mailService.unreadMessages.subscribe((messageIds: string[]) =>  this.unreadMessages = messageIds);
  }

  openDialog(event: Thread) {
    this.store.dispatch(new MailActions.OpenDetailDialog(event.messages[0]));
  }

  isRead(message: MailMessage): boolean{
    if(this.unreadMessages.includes(message.id)){
      return false;
    }
    return true;
  }

  @Input()
  set filter(filter){
    this._filter = filter;
    switch (this._filter){
      case Filters.all:{
        this.threads = this.unfilteredThreads;
        break;
      }
      case Filters.inbox:{
        this.threads = _.filter(this.unfilteredThreads,  (thread) => thread.messages[0].labelIds.includes('INBOX'));
        break;
      }
      case Filters.unread:{
        this.threads = _.filter(this.unfilteredThreads,  (thread) => !this.isRead(thread.messages[0]));
        break;
      }
      case Filters.personal:{
        this.threads = _.filter(this.unfilteredThreads,  (thread) => thread.messages[0].labelIds.includes('CATEGORY_PERSONAL'));
        break;
      }
      case Filters.promotions:{
        this.threads = _.filter(this.unfilteredThreads, (thread) => thread.messages[0].labelIds.includes('CATEGORY_PROMOTIONS'));
        break;
      }
      case Filters.social:{
        this.threads = _.filter(this.unfilteredThreads, (thread) => thread.messages[0].labelIds.includes('CATEGORY_SOCIAL'));
        break;
      }
      default:{
        this.threads = this.unfilteredThreads;
      }
    }
    console.log('Filtered Messages: ',this.threads);
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
