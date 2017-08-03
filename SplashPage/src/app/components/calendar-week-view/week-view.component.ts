import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { CalendarService } from "app/services/calendar.service";
import * as _ from 'lodash';

@Component({
  selector: 'week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss']
})
export class WeekViewComponent {

  times = ['12:00am', '1:00am', '2:00am', '3:00am', '4:00am', '5:00am', '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am',
          '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm', '11:00pm', ]
  dates: string[] = [];
  todaysDate: string;
  allDayEvents: Observable<{ [key: string] : CalendarEvent[]}>;
  timedEvents: Observable<{[key: string] : CalendarEvent[]}>;

  constructor(private calendarService: CalendarService) {
    this._buildDates();
    this._setTodaysDate();
    this.allDayEvents = this.calendarService.events.map(events => this.getAllDayEvents(events));
    this.timedEvents = this.calendarService.events.map(events => this.getTimedEvents(events));
  }

  getTimedEvents(events: CalendarEvent[]){
    let timedEvents = _.filter(events, {'allDayEvent':false});
    return this._filterEvents(timedEvents);
  }

  getAllDayEvents(events: CalendarEvent[]){
    let allDayEvents = _.filter(events, {'allDayEvent':true});
    return this._filterEvents(allDayEvents);
  }

  private _filterEvents(events: CalendarEvent[]): any{
    let groupedEvents = _.groupBy(events,'startDate');
    let pickedEvents = _.pick(groupedEvents,this.dates);
    let datesWithEvents = _.keys(pickedEvents);
    let missingDates = _.difference(this.dates,datesWithEvents);
    for(let missingDate of missingDates){
      pickedEvents[missingDate] = [];
    }
    return pickedEvents;
  }

  private _buildDates() {
    let firstDayOfWeek = this.getFirstDayOfWeek();
    for (let i = 0; i < 7; i++) {
      let d = new Date();
      d.setDate(firstDayOfWeek.getDate() + i);
      let year = String(d.getFullYear());
      let month = String(d.getMonth());
      month = month.length > 1 ? month : '0' + month;
      let date = String(d.getDate())
      date = date.length > 1 ? date : '0' + date;
      let dateString = year + '-' + month + '-' + date;
      this.dates.push(dateString);
    }
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
   * Returns the Date object representing the first day of the week
   */
  private getFirstDayOfWeek(): Date {
    let d = new Date();
    let day = d.getDay();
    let diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

}
