import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
import { MailMessage } from "app/store/mail/mail-message";

interface MessageForm {
  recipient: string,
  subject: string,
  inReplyTo: string,
  message: string
}

@Component({
  selector: 'app-mail-send-dialog',
  templateUrl: './mail-send-dialog.component.html',
  styleUrls: ['./mail-send-dialog.component.scss']
})
export class MailSendDialogComponent implements OnInit {

  readonly CANCEL = 'CANCEL';
  readonly SEND = 'SEND';

  public messageForm: MessageForm = {
    recipient : '',
    subject : '',
    inReplyTo : '',
    message : ''
  }
  public message: MailMessage;

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<MailSendDialogComponent>) { }


  ngOnInit() {
    if (this.data.message !== '') {
      this.message = this.data.message;
      this.messageForm.recipient = this.message.headers['reply-to'] || this.message.headers['from'];
      this.messageForm.subject = (this.message.headers['subject'] && 'Re ' + this.message.headers['subject'].replace(/\"/g, '&quot;')) || 'Re: No Subject';
      this.messageForm.inReplyTo = this.message.id;
    }
  }

  closeDialog(action: string): void {
    if (action === this.CANCEL) {
      this.dialogRef.close(null);
      return;
    }

    this.dialogRef.close([action, this.messageForm]);
    
  }

}
