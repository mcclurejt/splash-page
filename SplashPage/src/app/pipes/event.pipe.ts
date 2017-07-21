import { CalendarEvent } from './../models/calendar-event';
import { Observable } from 'rxjs/Observable';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'event'
})
export class EventPipe implements PipeTransform {

  transform(eventStream: Observable<CalendarEvent[]>, view: string): Observable<any> {
    switch (view) {
      case 'agenda': {
        return this.agendaViewFilter(eventStream);
      }
      case 'week': {

      }
    }
    return null;
  }

  agendaViewFilter(eventStream: Observable<CalendarEvent[]>): Observable<Array<CalendarEvent[]>> {
    return eventStream
      .map((events: CalendarEvent[]) => {
        let sortedEvents = events.sort(this.compareStartDates);
        let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1);
        let filteredEvents = this.getEventsFromDate(sortedEvents,today);
        let groupedEvents = [];
        let sameDayEvents = []
        for(let i = 0; i < filteredEvents.length; i++){
          if(sameDayEvents.length == 0){
            sameDayEvents.push(filteredEvents[i]);
          } else if(filteredEvents[i].startDate == sameDayEvents[0].startDate){
            sameDayEvents.push(filteredEvents[i]);
          } else {
            groupedEvents.push(sameDayEvents);
            sameDayEvents = [filteredEvents[i]];
          }
        }
        if(sameDayEvents.length != 0){
          groupedEvents.push(sameDayEvents);
        }
        return groupedEvents;
      });
  }

  compareStartDates(event1: CalendarEvent, event2: CalendarEvent) {
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
  getEventsFromDate(sortedEvents: CalendarEvent[], d: Date) {
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
}
