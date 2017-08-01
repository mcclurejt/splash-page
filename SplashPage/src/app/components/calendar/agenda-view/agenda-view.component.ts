import { CalendarService } from './../../../services/calendar.service';
import { CalendarComponent } from './../calendar.component';
import { Observable } from 'rxjs/Observable';
import { CalendarEvent } from './../../../models/calendar-event';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'agenda-view',
  templateUrl: './agenda-view.component.html',
  styleUrls: ['./agenda-view.component.scss']
})
export class AgendaViewComponent implements OnInit {
  events: Observable<Array<CalendarEvent[]>>;
  todaysDate: string
  isScrollLoading: false;

  constructor(private calendarService: CalendarService) {
    this._setTodaysDate();
  }

  ngOnInit() {
    this.events = this.calendarService.events
      .map(events => this.agendaViewFilter(events));
  }

  openDialog(mode: string, event: CalendarEvent) {
    this.calendarService.openDialog(mode, event);
  }

  onScrollDown() {
    this.calendarService.onScrollDown();
  }

  private agendaViewFilter(events): Array<CalendarEvent[]> {
    let sortedEvents = events.sort(this.compareStartDates);
    let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1);
    let filteredEvents = this.getEventsFromDate(sortedEvents, today);
    let groupedEvents = new Array<CalendarEvent[]>();
    let sameDayEvents = new Array<CalendarEvent>();
    for (let i = 0; i < filteredEvents.length; i++) {
      if (sameDayEvents.length == 0) {
        sameDayEvents.push(filteredEvents[i]);
      } else if (filteredEvents[i].startDate == sameDayEvents[0].startDate) {
        sameDayEvents.push(filteredEvents[i]);
      } else {
        groupedEvents.push(sameDayEvents);
        sameDayEvents = [filteredEvents[i]];
      }
    }

    if (sameDayEvents.length != 0) {
      groupedEvents.push(sameDayEvents);
    }

    return groupedEvents;
  }

  private compareStartDates(event1: CalendarEvent, event2: CalendarEvent): number {
    let time1 = new Date(event1.startDate);
    let time2 = new Date(event2.startDate);
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
      let eventDate = new Date(event.startDate);
      // Push the event if today or later
      if (d.getTime() <= eventDate.getTime()) {
        sortedEventsAfterDate.push(event);
      }
    }
    return sortedEventsAfterDate;
  }

  private _setTodaysDate() {
    let d = new Date();
    let year = String(d.getFullYear());
    let month = String(d.getMonth() + 1);
    month = month.length > 1 ? month : '0' + month;
    let date = String(d.getDate())
    date = date.length > 1 ? date : '0' + date;
    this.todaysDate = year + '-' + month + '-' + date;
  }

  /**
   * Returns the provided date in RFC3339 format to be used in requests to Google's Apis
   * @param d Date object representing the desired date
   */
  private getRFC3339Date(d: Date): string {
    let pad = (n) => { return n < 10 ? "0" + n : n; };
    let timezoneOffset = (offset) => {
      let sign;
      if (offset === 0) {
        return 'Z';
      }
      sign = (offset > 0) ? '-' : '+';
      offset = Math.abs(offset);
      return sign + pad(Math.floor(offset / 60)) + ':' + pad(offset % 60);
    }
    return d.getFullYear() + "-" +
      pad(d.getMonth() + 1) + "-" +
      pad(d.getDate()) + "T" +
      pad(d.getHours()) + ":" +
      pad(d.getMinutes()) + ":" +
      pad(d.getSeconds()) +
      timezoneOffset(d.getTimezoneOffset());
  }
  /**
   * Returns the Date object representing the first day of the week
   */
  private getFirstDayOfWeek(): Date {
    let d = new Date();
    let day = d.getDay();
    let diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
}
