import { CalendarService } from 'app/services/calendar.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent{
  @Input() view: string;
  
  constructor(private calendarService: CalendarService) {
    
  }
}

