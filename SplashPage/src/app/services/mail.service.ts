import { Injectable } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";
import { Store } from "@ngrx/store";
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';
import { Observable } from "rxjs/Observable";
import { MailMessage } from "app/store/mail/mail-message";
import { MailThread } from "app/store/mail/mail.reducer";

@Injectable()
export class MailService {

  public messages: Observable<MailMessage[]>;
  public threads: Observable<MailThread>;

  constructor(public gmailService: GmailService, private store: Store<fromRoot.State>) {
    this.messages = this.store.select(store => store.mail.messages);
    this.threads = this.store.select(store => store.mail.threads);

    this.loadAllEmails();
  }

  loadAllEmails() {
    console.log('Load All Emails');
    this.gmailService.getEmails();
  }

  onScrollDown() {
    console.log('Scrolled down');
  }
}
