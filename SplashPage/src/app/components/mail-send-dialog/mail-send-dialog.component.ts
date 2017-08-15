import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from "@angular/material";
import { MailMessage } from "app/store/mail/mail-message";

interface MessageForm {
  recipient: string,
  subject: string,
  inReplyTo: string,
  message: string,
  threadId: string
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
    message : '',
    threadId: ''
  }
  public message: MailMessage;

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<MailSendDialogComponent>) { }


  ngOnInit() {
    if (this.data.message !== '') {
      this.message = this.data.message;
      this.messageForm.recipient = this.message.headers['reply-to'] || this.message.headers['from'];
      this.messageForm.subject = this.message.headers['subject'] || 'Re: No Subject';
      this.messageForm.inReplyTo = this.message.id;
      this.messageForm.threadId = this.message.threadId;
    }
  }

  closeDialog(action: string): void {
    if (action === this.CANCEL) {
      this.dialogRef.close(null);
      return;
    }
    if(this.messageForm.inReplyTo) {
      action = 'REPLY';
    }
    this.dialogRef.close([action, this.messageForm]);
    
  }

}
