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

  constructor( @Inject(MD_DIALOG_DATA) public data: any, public diatlogRef: MdDialogRef<MailDetailDialogComponent>) {
  }

  ngOnInit() {
    this.message = this.data.message;
    console.log("MessageDialog: ", this.message);
    // Is the message in the lookupTable,
    // if so, use it, if not, get it. Probably do this logic in the store. or the service
    
  }

}
