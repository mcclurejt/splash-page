import { Component, OnInit } from '@angular/core';
import { MailService } from "app/services/mail.service";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { MailMessage } from "app/store/mail/mail-message";

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
  
  public threads: Observable<Thread[]>;

  constructor(private mailService: MailService) { }

  ngOnInit() {
    this.threads = this.mailService.threads
    .map(threads => this.simpleInboxViewFilter(threads));
  }

  openDialog(event: Thread) {
    this.mailService.openDialogHandler(event.messages[0].id);
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
