import { MailThread } from 'app/store/mail/mail.reducer';
import { Component, Inject, OnInit, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from "@angular/material";
import { MailMessage } from "app/store/mail/mail-message";
import { Observable } from "rxjs/Observable";
import { MailSendDialogComponent } from "app/components/mail-send-dialog/mail-send-dialog.component";
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';
import { Store } from '@ngrx/store';
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-mail-detail-dialog',
  templateUrl: './mail-detail-dialog.component.html',
  styleUrls: ['./mail-detail-dialog.component.scss']
})
export class MailDetailDialogComponent implements OnInit, OnDestroy {
  
  public threads: MailThread;
  public baseMessage: MailMessage;
  public messages: Observable<MailMessage[]>;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<MailDetailDialogComponent>,
    public dialogSendRef: MdDialog,
    private store: Store<fromRoot.State>) {
    this.baseMessage = data.message;
    this.messages = this.store
      .select(state => state.mail.messageLookup)
      .withLatestFrom(this.store.select(state => state.mail.threads).map((threads) => threads[this.baseMessage.threadId]))
      .map(([messageLookup,messages]) => this.mapFullMessages(messageLookup,messages))
  }

  ngOnInit(): void {
    this.setIframeContent(this.baseMessage);
  }

  setIframeContent(message: MailMessage): void{
    let iframe = document.getElementById('mail-iframe');
    let doc = (<HTMLIFrameElement>iframe).contentDocument || (<HTMLIFrameElement>iframe).contentWindow.document;
    let body = doc.body;
    if (message.textHtml === ''){
      body.innerHTML = message.textPlain;
    } else {
      body.innerHTML = message.textHtml;
    }
  }

  mapFullMessages(messageLookup, messages: MailMessage[]): MailMessage[]{
    let fullMessages = [];
    for(let message of messages){
      if(messageLookup[message.id]){
        fullMessages.push(messageLookup[message.id]);
      }
    }
    fullMessages.sort(this.sortByDate);
    return fullMessages;
  }

  sortByDate(msg1: MailMessage, msg2: MailMessage): number{
    if(msg2.internalDate < msg1.internalDate){
      return -1;
    }
    if(msg1.internalDate < msg2.internalDate){
      return 1;
    }
    return 0;
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  replyCloseDialog(): void {
    this.dialogRef.close(this.messages[0]);
  }

  ngOnDestroy(): void {
    
  }

}
