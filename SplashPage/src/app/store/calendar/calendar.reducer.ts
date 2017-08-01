import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Calendar } from 'app/store/calendar/calendar';
import * as CalendarActions from './calendar.actions'

export interface State {
  calendars: Calendar[],
  events: CalendarEvent[],
}

const initialState: State = {
  calendars: [],
  events: [],
}

export function reducer(state = initialState, action: CalendarActions.All): State {
  switch (action.type) {

    case CalendarActions.CALENDAR_ADD: {
      let newState;
      if (Array.isArray(action.payload)) {
        newState = Object.assign({
          calendars: [...action.payload,...state.calendars],
          events: [...state.events],
        });
      } else {
        newState = Object.assign({
          calendars: [action.payload,...state.calendars],
          events: [...state.events],
        })
      }
      // console.log('CALENDAR_ADD New State', newState);
      return newState;
    }

    case CalendarActions.CALENDAR_CLEAR_ALL: {
      // console.log('CALENDAR_CLEAR_ALL');
      return {
        calendars: [],
        events: Object.assign([], state.events),
      }
    }

    case CalendarActions.EVENT_ADD: {
      let newState;
      if (Array.isArray(action.payload)) {
        newState = Object.assign({
          calendars: [...state.calendars],
          events: [...action.payload, ...state.events]
        });
      } else {
        newState = Object.assign({
          calendars: [...state.calendars],
          events: [action.payload, ...state.events]
        });
      }
      // console.log('EVENT_ADD', newState);
      return newState;
    }

    case CalendarActions.EVENT_DELETE: {
      let newState = Object.assign({}, state);
      newState.events = newState.events.filter((event) => event.id != action.payload.id);
      // console.log('EVENT_DELETE New State', newState);
      return newState;
    }

    default: {
      return state;
    }
  }
}
