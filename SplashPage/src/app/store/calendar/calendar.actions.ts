import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Calendar } from 'app/store/calendar/calendar';
import { Action } from "@ngrx/store";

export const ON_STATE_CHANGE = 'CALENDAR_ON_STATE_CHANGE'
export const CALENDAR_ADD = 'CALENDAR_ADD';
export const CALENDAR_CLEAR_ALL = 'CALENDAR_CLEAR_ALL';
export const EVENT_ADD = 'EVENT_ADD';
export const HANDLE_EVENT_ADD = 'HANDLE_EVENT_ADD';
export const EVENT_EDIT = 'EVENT_EDIT'
export const EVENT_DELETE = 'EVENT_DELETE';
export const HANDLE_EVENT_DELETE = 'HANDLE_EVENT_DELETE';
export const START_LOADING = 'CALENDAR_START_LOADING';
export const STOP_LOADING = 'CALENDAR_STOP_LOADING';

export class OnStateChange implements Action {
    readonly type = ON_STATE_CHANGE;

    constructor() { }
}

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

    constructor(public payload: any){}
}

export class HandleEventAdd implements Action{
    readonly type = HANDLE_EVENT_ADD;

    constructor(public payload: CalendarEvent | CalendarEvent[]){}
}

export class EventEdit implements Action {
    readonly type = EVENT_EDIT;

    constructor(public payload: any){}
}

export class EventDelete implements Action {
    readonly type = EVENT_DELETE;

    constructor(public payload: any){};
}

export class HandleEventDelete implements Action{
    readonly type = HANDLE_EVENT_DELETE;

    constructor(public payload: CalendarEvent){}
}

export class StartLoading implements Action{
    readonly type = START_LOADING;

    constructor(){}
}

export class StopLoading implements Action{
    readonly type = STOP_LOADING;

    constructor(){}
}

export type All = OnStateChange | CalendarAdd | CalendarClearAll | HandleEventAdd | HandleEventDelete | EventAdd | EventDelete | EventEdit | StartLoading | StopLoading;