import { Thread } from './../services/mail.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { MailService} from "app/services/mail.service";
import { Filter } from 'app/store/mail/mail.reducer';

@Component({
  selector: 'app-mail-tab',
  templateUrl: './mail-tab.component.html',
  styleUrls: ['./mail-tab.component.scss']
})
export class MailTabComponent {

  public all = Filter.all;
  public inbox = Filter.inbox;
  public personal = Filter.personal;
  public promotions = Filter.promotions;
  public social = Filter.social;
  public unread = Filter.unread;

  threads: Observable<Thread[]>

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
