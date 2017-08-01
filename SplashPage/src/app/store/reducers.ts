import * as fromWeather from './weather/weather.reducer'
import * as fromCalendar from './calendar/calendar.reducer'
import * as fromAuth from './auth/auth.reducer'
export interface State {
    weather: fromWeather.State;
    calendar: fromCalendar.State;
    auth: fromAuth.State;
}

export const reducers = {
    weather: fromWeather.reducer,
    calendar: fromCalendar.reducer,
    auth: fromAuth.reducer,
};