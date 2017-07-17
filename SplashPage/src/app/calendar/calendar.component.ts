import { GapiService, CalendarList } from './../services/gapi.service';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  constructor(private gapiService: GapiService) {
    this.gapiService.isLoadedStream.subscribe( (isLoaded) => {
      console.log('Check loaded');
      if(isLoaded){
        console.log('Gapi Loaded');
        this.loadCalendar();
      };
    });
  }

  loadCalendar() {
    this.gapiService.getCalendarList().then( (calList: CalendarList) => {
      console.log('CalendarList',calList);
    })
  }

  ngOnInit(): void{

  }

  ngOnDestroy(): void {
  }

}
