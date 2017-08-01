import * as fromWeather from './weather.reducer'
import * as fromCalendar from './calendar.reducer'
export interface State {
    weather: fromWeather.State;
    calendar: fromCalendar.State;
}

export const reducers = {
    weather: fromWeather.reducer,
    calendar: fromCalendar.reducer,
};