import { Observable } from 'rxjs/Observable';
import { GapiService } from 'app/content-providers/google/gapi.service';
import { Component, OnInit, Input } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";
import { MailService, Filters } from "app/services/mail.service";
import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
  @Input() heightInput: string;

  filters = Filters;
  currentFilter = Filters.all;

  constructor(public mailService: MailService) {}

  onScroll(){
    this.mailService.onScroll();
  }

}
