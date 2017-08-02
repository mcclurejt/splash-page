import { Injectable } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";
import { Store } from "@ngrx/store";
import * as fromRoot from 'app/store/reducers';

@Injectable()
export class MailService {

  constructor(public gmailService: GmailService, private store: Store<fromRoot.State>) {
    this.loadAllEmails();
  }



  loadAllEmails() {
    console.log('Load All Emails');
    this.gmailService.getEmails();
  }
}
