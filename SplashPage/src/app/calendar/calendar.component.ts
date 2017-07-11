import { GapiService } from './../services/gapi.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendarList: gapi.client.calendar.CalendarList;
  api: any;

  constructor(private gapiService: GapiService) {
    
  }
  
  ngOnInit() {
    
    
  }

  getCalendarList(){
    let batch: gapi.client.HttpBatch = this.gapiService.getBatch();
    let requestParams = {
      path: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      method: 'GET',
    }
    batch.add(this.gapiService.getRequest(requestParams));
    batch.execute( (resp) => {
      console.log(resp);
    })
  }



}
