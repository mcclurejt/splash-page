import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { MailService } from "app/services/mail.service";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { MailMessage } from "app/store/mail/mail-message";
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';
import {Thread, Filters} from 'app/services/mail.service';

@Component({
  selector: 'app-mail-simple-inbox-view',
  templateUrl: './mail-simple-inbox-view.component.html',
  styleUrls: ['./mail-simple-inbox-view.component.scss']
})
export class MailSimpleInboxViewComponent {
  
  private _filter;
  public threads: Observable<Thread[]>;

  constructor(private mailService: MailService, private store: Store<fromRoot.State>,) { }

  openDialog(event: Thread) {
    this.store.dispatch(new MailActions.OpenDetailDialog(event.messages[0]));
  }

  @Input()
  set filter(filter){
    if(this._filter && this._filter == filter){
      // Don't do anything
    } else {
      this._filter == filter;
      console.log('Inbox Filter',filter);
      this.threads = this.mailService.getFilteredMessages(filter);
    }
  }

}
