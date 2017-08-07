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
  private mailLoaded = false;
  public messages: Observable<MailMessage[]>;
  public threads: Observable<MailThread>;

  constructor(public gmailService: GmailService, private store: Store<fromRoot.State>) {
    this.messages = this.store.select(store => store.mail.messages);
    this.threads = this.store.select(store => store.mail.threads);
  }



  loadAllEmails() {
    if(this.mailLoaded){
      console.log('TODO: Handle Updating Emails');
    } else {
      this.gmailService.loadEmails();
      this.mailLoaded = true;
    }
  }
}
