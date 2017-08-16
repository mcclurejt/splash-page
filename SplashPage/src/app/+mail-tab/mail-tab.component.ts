import { Component, OnInit } from '@angular/core';
import { MailService } from "app/services/mail.service";
import { Filters } from 'app/components/mail-simple-inbox-view/mail-simple-inbox-view.component';

@Component({
  selector: 'app-mail-tab',
  templateUrl: './mail-tab.component.html',
  styleUrls: ['./mail-tab.component.scss']
})
export class MailTabComponent implements OnInit {

  filters = Filters;
  currentFilter = Filters.all;
  
  constructor(public mailService: MailService) { }

  ngOnInit() {
  }

}
