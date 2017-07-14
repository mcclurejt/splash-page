import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../services/auth.service';
import { GoogleService } from './../services/google.service';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnDestroy{

  isLoaded: boolean;
  gapiSubscription: Subscription;

  constructor(private googleService: GoogleService) {
    this.gapiSubscription = this.googleService.isSignedInSubject.subscribe( (isSignedIn) => {
      if(isSignedIn){
        this.loadCalendar();
      };
    });
  }

  loadCalendar(){
    let loadSuccess = (response) => {
      console.log(response.result.items);
    }

    let loadFail = (error) => {
      console.log(error);
    }
    this.googleService.getCalendarList().then( (response) => {
      console.log(response.result);
    });
  }

  ngOnDestroy(): void {
    this.gapiSubscription.unsubscribe();
  }
  
}
