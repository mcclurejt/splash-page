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
import { MailSendDialogComponent } from "app/components/mail-send-dialog/mail-send-dialog.component";

@Injectable()
export class MailService {
  private mailLoaded = false;
  public messages: Observable<MailMessage[]>;
  public threads: Observable<MailThread>;
  public messageLookup: Observable<MailMessageLookup>;
  public loading: Observable<boolean>;

  constructor(public gmailService: GmailService, private store: Store<fromRoot.State>, public dialog: MdDialog, public dialogSend: MdDialog) {
    this.messages = this.store.select(store => store.mail.messages);
    this.threads = this.store.select(store => store.mail.threads);
    this.messageLookup = this.store.select(store => store.mail.messageLookup);
    this.loading = this.store.select(store => store.mail.loading);
  }

  openDialog(message: MailMessage): void {
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

  openSendDialog(message?: any): void {
    let dialogRef = this.dialogSend.open(MailSendDialogComponent, {
      panelClass: 'mail-send-dialog-styling',
      data : {
        message: message,
        isReply: message !== null
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
        this.gmailService.sendEmail({
          'To': messageForm.recipient,
          'Subject': messageForm.subject,
          'In-Reply-To': messageForm.inReplyTo
        }, messageForm.message);
      }
    });
  }

  onScrollDown() {
    console.log('Scrolled down');
  }
}
