import { CalendarService } from 'app/services/calendar.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit{
  @Input() view: string;
  
  constructor(private calendarService: CalendarService) {
    
  }

  ngOnInit(): void {
    this.calendarService.loadAllCalendars();
    console.log('view',this.view);
  }
}

