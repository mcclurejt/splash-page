import { Weather, initialWeather } from './../models/weather';
import { Action } from './../models/action';


// Actions
export const ADD = 'ADD';

// Reducer
export function weatherReducer(state: Weather = initialWeather, action: Action) {
    switch (action.type) {
        case ADD:
            return action.payload;
        default:
            return state;
    }
}