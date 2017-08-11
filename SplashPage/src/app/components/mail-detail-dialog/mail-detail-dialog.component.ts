import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { MailMessage } from "app/store/mail/mail-message";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-mail-detail-dialog',
  templateUrl: './mail-detail-dialog.component.html',
  styleUrls: ['./mail-detail-dialog.component.scss']
})
export class MailDetailDialogComponent implements OnInit {

  public message: MailMessage;
  public loading: string = '<p>Loading...</p>';

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public diatlogRef: MdDialogRef<MailDetailDialogComponent>) {
  }

  ngOnInit() {
    this.message = this.data.message;
    this.loading = this.message.textHtml;
    // let temp: any = document.getElementById("message-iframe");
    // console.log(temp);
    // ifrm.document.body.innerHTML(this.message.textHtml);
    // Is the message in the lookupTable,
    // if so, use it, if not, get it. Probably do this logic in the store. or the service
    
  }

}
