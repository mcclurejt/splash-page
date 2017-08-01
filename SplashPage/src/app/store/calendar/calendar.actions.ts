import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Calendar } from 'app/store/calendar/calendar';
import { Action } from "@ngrx/store";

export const CALENDAR_ADD = 'CALENDAR_ADD';
export const CALENDAR_CLEAR_ALL = 'CALENDAR_CLEAR_ALL';
export const EVENT_ADD = 'EVENT_ADD';
export const EVENT_DELETE = 'EVENT_DELETE'

export class CalendarAdd implements Action {
    readonly type = CALENDAR_ADD;

    constructor(public payload: Calendar | Calendar[]) { }
}

export class CalendarClearAll implements Action {
    readonly type = CALENDAR_CLEAR_ALL;

    constructor(){}
}

export class EventAdd implements Action {
    readonly type = EVENT_ADD;

    constructor(public payload: CalendarEvent | CalendarEvent[]){}
}

export class EventDelete implements Action {
    readonly type = EVENT_DELETE;

    constructor(public payload: CalendarEvent){};
}

export type All = CalendarAdd | CalendarClearAll | EventAdd | EventDelete;