import { Component, Inject, OnInit, AfterContentInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { MailMessage } from "app/store/mail/mail-message";
import { Observable } from "rxjs/Observable";
import { Renderer2, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-mail-detail-dialog',
  templateUrl: './mail-detail-dialog.component.html',
  styleUrls: ['./mail-detail-dialog.component.scss']
})
export class MailDetailDialogComponent implements AfterViewInit{

  public message: MailMessage;
  public loading: string = '<p>Loading...</p>';

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<MailDetailDialogComponent>) {
    this.message = this.data.message;
    this.loading = this.message.textHtml;
  }

  ngAfterViewInit(): void {
    let iframe = document.getElementById('mail-iframe');
    let doc = (<HTMLIFrameElement>iframe).contentDocument || (<HTMLIFrameElement>iframe).contentWindow.document;
    let body = doc.body
    if(body && body.innerHTML){
      body.innerHTML = this.message.textHtml;
      console.log('iframe', iframe);
      console.log('doc', doc);
      console.log('body', body.style);
      console.log('table: ', body.getElementsByTagName('table')[0]);
      console.log('scrollHeight',body.scrollHeight);
      console.log('scrollWidth',body.scrollWidth)
      // iframe.style.height = body.getElementsByTagName('table')[0].clientHeight + 'px';
      // iframe.style.width = body.getElementsByTagName('table')[0].clientWidth + 'px';
      // iframe.style.height = body.scrollHeight + 'px';
      iframe.style.width = body.scrollWidth + 'px';
    } else {
      console.log('Body or InnerHTML could not be found, cant find a fix for this');
      this.dialogRef.close();
    }
  }

}
