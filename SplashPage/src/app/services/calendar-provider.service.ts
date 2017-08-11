import { CalendarEvent } from './../store/calendar/calendar-event';
import { Observable } from 'rxjs/Observable';
import { Calendar } from './../store/calendar/calendar';
import { Injectable } from '@angular/core';

export interface CalendarProvider{
  getCalendars(): Observable<Calendar[]>;
  getEvents(calendars: Calendar[], startDate?: Date): Observable<CalendarEvent[]>;
  addEvent(event: CalendarEvent, calendars: Calendar[]): Observable<CalendarEvent>;
  deleteEvent(event: CalendarEvent, calendars: Calendar[]): Observable<CalendarEvent[]>;
}

export const CalendarProviders = {
  Google : 'google',
}

@Injectable()
export class CalendarProviderService {

  constructor() { }

}
