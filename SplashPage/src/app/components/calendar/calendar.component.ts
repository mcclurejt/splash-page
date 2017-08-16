import { Router } from '@angular/router';
import { CalendarService } from 'app/services/calendar.service';
import { Component, Input } from '@angular/core';
import { CalendarEvent } from 'app/store/calendar/calendar-event'
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent{
  @Input() view: string;
  xsHeight: string;
  constructor(public calendarService: CalendarService, private router: Router) {
    this.setXsHeightFromUrl();
  }

  private setXsHeightFromUrl(){
    let url = this.router.url;
    if(url == '/calendar'){
      this.xsHeight = '100%';
    } else {
      this.xsHeight = '300px';
    }
  }
}

