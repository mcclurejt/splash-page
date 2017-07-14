import { AuthService } from './../services/auth.service';
import { GoogleService } from './../services/google.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor(private googleService: GoogleService) {
    
  }
  
  ngOnInit() {
  }

  
}
