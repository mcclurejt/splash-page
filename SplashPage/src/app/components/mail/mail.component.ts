import { Component, OnInit } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  constructor(private gmailService: GmailService) {
    
   }

  ngOnInit() {

  }

}
