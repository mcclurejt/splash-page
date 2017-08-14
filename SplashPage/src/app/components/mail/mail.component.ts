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
export class MailComponent {

  constructor(private mailService: MailService) {}

}
