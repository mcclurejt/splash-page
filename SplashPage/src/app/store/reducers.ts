import * as fromWeather from './weather.reducer'

export interface State {
    weather: fromWeather.State;
}

export const reducers = {
    weather: fromWeather.reducer,
};