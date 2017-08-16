import { Subscription } from 'rxjs/Rx';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MailService } from "app/services/mail.service";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { MailMessage } from "app/store/mail/mail-message";
import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store/reducers';
import * as MailActions from 'app/store/mail/mail.actions';
import { Thread } from 'app/services/mail.service';

@Component({
  selector: 'app-mail-simple-inbox-view',
  templateUrl: './mail-simple-inbox-view.component.html',
  styleUrls: ['./mail-simple-inbox-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailSimpleInboxViewComponent {

  @Input() threads: Thread[];

  constructor(private store: Store<fromRoot.State>) { }

  openDialog(event: Thread) {
    this.store.dispatch(new MailActions.OpenDetailDialog(event.messages[0]));
  }

}
