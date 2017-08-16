import { Thread } from './../../services/mail.service';
import { Observable } from 'rxjs/Observable';
import { GapiService } from 'app/content-providers/google/gapi.service';
import { Component, OnInit, Input } from '@angular/core';
import { GmailService } from "app/content-providers/google/gmail.service";
import { MailService} from "app/services/mail.service";
import { Filter } from 'app/store/mail/mail.reducer';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {
  @Input() heightInput: string;

  public all = Filter.all;
  public inbox = Filter.inbox;
  public personal = Filter.personal;
  public promotions = Filter.promotions;
  public social = Filter.social;
  public unread = Filter.unread;

  public threads : Observable<Thread[]>

  constructor(public mailService: MailService) {
    this.threads = this.mailService.viewThreads;
  }

  onScroll(){
    this.mailService.onScroll();
  }

  updateFilter(filter: Filter){
    this.mailService.updateFilter(filter);
  }

}
