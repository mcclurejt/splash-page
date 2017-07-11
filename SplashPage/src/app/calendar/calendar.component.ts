import { GapiService } from './../services/gapi.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendarList: gapi.client.calendar.CalendarList;

  constructor(gapiService: GapiService) {
    
    gapiService.getCalendarList().then( (resp) => {
      this.calendarList = resp.result;
   });

  }
  
  ngOnInit() {
    
    
  }



}
