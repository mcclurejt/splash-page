import { CalendarEvent } from 'app/store/calendar/calendar-event';
import { Calendar } from 'app/store/calendar/calendar';
import * as CalendarActions from './calendar.actions'

export interface State {
  calendars: Calendar[],
  events: CalendarEvent[],
  loading: boolean,
}

const initialState: State = {
  calendars: [],
  events: [],
  loading: false,
}

export function reducer(state = initialState, action: CalendarActions.All): State {
  switch (action.type) {
    
    case CalendarActions.CALENDAR_ADD: {
      console.log(CalendarActions.CALENDAR_ADD);
      let newState;
      if (Array.isArray(action.payload)) {
        newState = Object.assign({
          calendars: [...action.payload,...state.calendars],
          events: [...state.events],
          loading: state.loading,
        });
      } else {
        newState = Object.assign({
          calendars: [action.payload,...state.calendars],
          events: [...state.events],
          loading: state.loading,
        })
      }
      // console.log('CALENDAR_ADD New State', newState);
      return newState;
    }

    case CalendarActions.CALENDAR_CLEAR_ALL: {
      console.log(CalendarActions.CALENDAR_CLEAR_ALL);
      return Object.assign({},initialState);
    }

    case CalendarActions.HANDLE_EVENT_ADD: {
      console.log(CalendarActions.HANDLE_EVENT_ADD);
      if(action.payload == null){
        return state;
      }

      let newState;
      if (Array.isArray(action.payload)) {
        newState = Object.assign({
          calendars: [...state.calendars],
          events: [...action.payload, ...state.events],
          loading: state.loading,
        });
      } else {
        newState = Object.assign({
          calendars: [...state.calendars],
          events: [action.payload, ...state.events],
          loading: state.loading,
        });
      }
      return newState;
    }

    case CalendarActions.HANDLE_EVENT_DELETE: {
      console.log(CalendarActions.HANDLE_EVENT_DELETE);
      let newState = Object.assign({}, state);
      newState.events = newState.events.filter((event) => event.id != action.payload.id);
      return newState;
    }

    case CalendarActions.START_LOADING: {
      console.log(CalendarActions.START_LOADING);
      let newState = Object.assign({},state);
      newState.loading = true;
      return newState;
    }

    case CalendarActions.STOP_LOADING: {
      console.log(CalendarActions.STOP_LOADING);
      let newState = Object.assign({},state);
      newState.loading = false;
      return newState;
    }

    default: {
      return state;
    }
  }
}
