import { Component, Inject, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from "@angular/material";
import { MailMessage } from "app/store/mail/mail-message";
import { Observable } from "rxjs/Observable";
import { MailSendDialogComponent } from "app/components/mail-send-dialog/mail-send-dialog.component";

@Component({
  selector: 'app-mail-detail-dialog',
  templateUrl: './mail-detail-dialog.component.html',
  styleUrls: ['./mail-detail-dialog.component.scss']
})
export class MailDetailDialogComponent implements OnInit {

  public message: MailMessage;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<MailDetailDialogComponent>,
    public dialogSendRef: MdDialog) {
    this.message = data.message;
  }

  ngOnInit(): void {
    let iframe = document.getElementById('mail-iframe');
    let doc = (<HTMLIFrameElement>iframe).contentDocument || (<HTMLIFrameElement>iframe).contentWindow.document;
    let body = doc.body;
    body.innerHTML = this.message.textHtml;
    iframe.style.width = body.scrollWidth + 'px';
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  replyCloseDialog(): void {
    this.dialogRef.close(this.message);
  }
}
