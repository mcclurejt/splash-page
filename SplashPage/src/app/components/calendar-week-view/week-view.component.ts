import { Subscription } from 'rxjs/Rx';
import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Observable } from 'rxjs/Observable';
import { Component, OnDestroy } from '@angular/core';
import { CalendarService } from "app/services/calendar.service";
import * as _ from 'lodash';

@Component({
  selector: 'week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss']
})
export class WeekViewComponent implements OnDestroy {

  private eventSub : Subscription;
  private firstDayOfWeek = this.getFirstDayOfWeek();
  dateObjArray: Date[] = [];
  dateArray: number[] = [];
  hourArray: Date[] = [];
  allDayEvents: CalendarEvent[][];
  timedEvents: any;

  constructor(private calendarService: CalendarService) {
    this.fillDateAndHourArrays();
    // this.allDayEvents = this.calendarService.events.map((events) => this.mapAllDayEvents(events));
    // this.timedEvents = this.calendarService.events.map((events) => this.mapTimedEvents(events));

    this.eventSub = this.calendarService.events.subscribe((events) => {
      this.allDayEvents = this.mapAllDayEvents(events);
      this.timedEvents = this.mapTimedEvents(events);
    });
  }

  openTimedDialog(dateIndex: number, h: number): void {
    let date = this.dateObjArray[dateIndex];
    let dateNum: number = this.dateArray[dateIndex];
    let event;
    if (this.timedEvents[dateNum][h].length < 1) {
      event = new CalendarEvent();
      event.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h)
      event.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h + 1)
      event.allDayEvent = false;
    } else {
      event = this.timedEvents[dateNum][h][0];
    }
    this.calendarService.openDialog(event);
  }

  openAllDayDialog(dateIndex: number, event?: CalendarEvent): void {
    if (event) {
      this.calendarService.openDialog(event);
      return;
    }
    event = new CalendarEvent();
    event.allDayEvent = true;
    event.startDate = this.dateObjArray[dateIndex];
    event.endDate = this.dateObjArray[dateIndex];
    this.calendarService.openDialog(event);

  }

  mapAllDayEvents(events: CalendarEvent[]): CalendarEvent[][] {
    let allDayEvents = _.filter(events, { 'allDayEvent': true });
    let allDayEventArray = []
    for (let event of allDayEvents) {
      let diff = event.startDate.getTime() - this.firstDayOfWeek.getTime();
      let idx = diff / (1000 * 3600 * 24);
      if (idx < 7) {
        allDayEventArray[idx] ? allDayEventArray[idx].push(event) : allDayEventArray[idx] = [event];
      }
    }
    return allDayEventArray;
  }

  mapTimedEvents(events: CalendarEvent[]) {
    // Build the struct
    let eventStruct = {};
    for (let date of this.dateArray) {
      for (let i = 0; i < 24; i++) {
        if (i == 0) {
          eventStruct[date] = { [i]: [] }
        } else {
          eventStruct[date][i] = [];
        }
      }
    }

    let timedEvents = _.filter(events, { 'allDayEvent': false });
    for (let event of timedEvents) {
      let startDayDiff = (event.startDate.getTime() - this.firstDayOfWeek.getTime()) / (1000 * 3600 * 24);
      if (startDayDiff < 7) {
        let hours = event.startDate.getHours();
        while (hours < event.endDate.getHours()) {
          let isInitialized = eventStruct[event.startDate.getDate()][hours] != undefined;
          if (isInitialized) {
            eventStruct[event.startDate.getDate()][hours].push(event);
          } else {
            eventStruct[event.startDate.getDate()][hours] = [event];
          }
          hours++;
        }
      }
    }
    // console.log('Timed Events: ', eventStruct);
    return eventStruct;
  }

  private fillDateAndHourArrays() {
    for (let i = 0; i < 7; i++) {
      let dow = new Date(this.firstDayOfWeek.getFullYear(), this.firstDayOfWeek.getMonth(), this.firstDayOfWeek.getDate() + i);
      this.dateObjArray.push(dow);
      this.dateArray.push(dow.getDate());
    }
    for (let i = 0; i < 24; i++) {
      let d = new Date();
      d.setHours(i);
      d.setMinutes(0);
      this.hourArray.push(d);
    }
  }

  /**
   * Returns the Date object representing the first day of the week
   */
  private getFirstDayOfWeek(): Date {
    let d = new Date();
    let day = d.getDay();
    let diff = d.getDate() - day;
    let newDate = new Date(d.setDate(diff));
    newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    return newDate;
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }

}
