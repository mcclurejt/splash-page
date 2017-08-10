import { CalendarService } from 'app/services/calendar.service';
import { CalendarComponent } from 'app/components/calendar/calendar.component';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'agenda-view',
  templateUrl: './agenda-view.component.html',
  styleUrls: ['./agenda-view.component.scss']
})
export class AgendaViewComponent implements OnInit {
  events: Observable<Array<CalendarEvent[]>>;
  todaysDate: Date;
  isScrollLoading: false;

  constructor(private calendarService: CalendarService) {
    this._setTodaysDate();
  }

  ngOnInit() {
    this.events = this.calendarService.events
      .map(events => this.agendaViewFilter(events));
  }

  openDialog(mode: string, event: CalendarEvent) {
    this.calendarService.openDialog(event);
  }

  onScrollDown() {
    this.calendarService.onScrollDown();
  }

  private agendaViewFilter(events): Array<CalendarEvent[]> {
    let sortedEvents = events.sort(this.compareStartDates);
    let filteredEvents = this.getEventsFromDate(sortedEvents, this.todaysDate);
    let groupedEvents = new Array<CalendarEvent[]>();
    let sameDayEvents = new Array<CalendarEvent>();
    for (let i = 0; i < filteredEvents.length; i++) {
      if (sameDayEvents.length == 0) {
        sameDayEvents.push(filteredEvents[i]);
      } else if (filteredEvents[i].startDate.toDateString() == sameDayEvents[0].startDate.toDateString()) {
        sameDayEvents.push(filteredEvents[i]);
      } else {
        groupedEvents.push(sameDayEvents);
        sameDayEvents = [filteredEvents[i]];
      }
    }

    if (sameDayEvents.length != 0) {
      groupedEvents.push(sameDayEvents);
    }
    console.log('GroupedEvents',groupedEvents);
    return groupedEvents;
  }

  private compareStartDates(event1: CalendarEvent, event2: CalendarEvent): number {
    let e1 = new Date(event1.startDate.getFullYear(),event1.startDate.getMonth(),event1.startDate.getDate())
    let e2 = new Date(event2.startDate.getFullYear(),event2.startDate.getMonth(),event2.startDate.getDate())
    let time1 = e1.getTime();
    let time2 = e2.getTime();
    if (time1 < time2) {
      return -1;
    }
    if (time2 < time1) {
      return 1;
    }
    return 0;
  }

  // Assumes events are sorted
  private getEventsFromDate(sortedEvents: CalendarEvent[], d: Date): CalendarEvent[] {
    let sortedEventsAfterDate: CalendarEvent[] = [];
    for (let event of sortedEvents) {
      // Push the event if today or later
      if (d.getTime() <= event.startDate.getTime()) {
        sortedEventsAfterDate.push(event);
      }
    }
    return sortedEventsAfterDate;
  }

  private _setTodaysDate() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    this.todaysDate = new Date(year,month,day);
  }
}
