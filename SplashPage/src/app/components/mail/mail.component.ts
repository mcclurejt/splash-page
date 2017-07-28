import { Observable } from 'rxjs/Observable';
import { GapiService } from 'app/content-providers/google/gapi.service';
import { Component, OnInit } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  isScrollLoading = false;
  mailStream : Observable<any>;


  constructor(private gmailService: GmailService, private gapiService: GapiService) {
    this.gapiService.getIsSignedInStream()
      .subscribe((isSignedIn: boolean) => {
        if (isSignedIn) {
          console.log("Loading messages");
          gmailService.getEmails().subscribe((emails) => {
            console.log('We got Emails',emails);
            
          })
        }
      })
  }

  ngOnInit() {

  }

  onScrollDown() {
    console.log('Scrolled down');
  }

}
