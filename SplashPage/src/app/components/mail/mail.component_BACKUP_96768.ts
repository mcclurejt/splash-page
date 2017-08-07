import { Observable } from 'rxjs/Observable';
import { GapiService } from 'app/content-providers/google/gapi.service';
import { Component, OnInit } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";
import { MailService } from "app/services/mail.service";

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  isScrollLoading = false;
  mailStream : Observable<any>;


  constructor(private mailService: MailService) {
<<<<<<< HEAD
=======
    mailService.threads.subscribe((messages) => {
      console.log(messages); 
     });
>>>>>>> c53a50dfac1c197e7f77390a11095818f832937f
  }

  ngOnInit() {
    this.mailService.loadAllEmails();
  }

  

}
