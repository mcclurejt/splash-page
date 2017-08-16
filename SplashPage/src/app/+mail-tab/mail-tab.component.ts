import { Component, OnInit } from '@angular/core';
import { MailService, Filters } from "app/services/mail.service";

@Component({
  selector: 'app-mail-tab',
  templateUrl: './mail-tab.component.html',
  styleUrls: ['./mail-tab.component.scss']
})
export class MailTabComponent {

  filters = Filters;
  currentFilter = Filters.all;
  
  constructor(public mailService: MailService) { }

  onScroll(){
    this.mailService.onScroll();
  }

}
