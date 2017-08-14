import { Injectable } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";
import { Store } from "@ngrx/store";
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';
import { Observable } from "rxjs/Observable";
import { MailMessage } from "app/store/mail/mail-message";
import { MailThread, MailMessageLookup } from "app/store/mail/mail.reducer";
import { Thread } from "app/components/mail-simple-inbox-view/mail-simple-inbox-view.component";
import { MdDialog } from "@angular/material";
import { MailDetailDialogComponent } from "app/components/mail-detail-dialog/mail-detail-dialog.component";

@Injectable()
export class MailService {
  private mailLoaded = false;
  public messages: Observable<MailMessage[]>;
  public threads: Observable<MailThread>;
  public messageLookup: Observable<MailMessageLookup>;

  constructor(public gmailService: GmailService, private store: Store<fromRoot.State>, public dialog: MdDialog) {
    this.messages = this.store.select(store => store.mail.messages);
    this.threads = this.store.select(store => store.mail.threads);
    this.messageLookup = this.store.select(store => store.mail.messageLookup);
  }

  loadAllEmails() {
    if(this.mailLoaded){
      console.log('TODO: Handle Updating Emails');
    } else {
      this.gmailService.loadEmails();
      this.mailLoaded = true;
    }
  }

  openDetailDialogHandler(messageId: string): void {
    this.messageLookup.subscribe((messageLookup) => {
      if (messageLookup[messageId]) {
        this.openDetailDialog(messageLookup[messageId]);
      } else {
        console.log("Message not in lookup");
        this.gmailService.fetchFullMessage(messageId)
        .subscribe((message: MailMessage) => {
          if (message != null) {
            console.log("message before open: ", message);
            this.openDetailDialog(message);
          }
        });
      }
    });
  }

  openDetailDialog(message: MailMessage): void {
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
      }
    });
  }

  openSendDialogHandler() {
    

  }

  onScrollDown() {
    console.log('Scrolled down');
  }
}
