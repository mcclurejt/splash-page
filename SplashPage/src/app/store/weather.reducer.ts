import * as WeatherActions from './weather.actions';

export interface State {
    city: string,
    region: string,
    temp: string,
    icon: string,
    loading: boolean,
}

const initialWeatherState: State = {
    city: '',
    region: '',
    temp: '',
    icon: '',
    loading: false,
}

export function reducer(state = initialWeatherState, action: WeatherActions.All): State {
    switch (action.type) {
        case WeatherActions.UPDATE: {
            return Object.assign(
                {},
                state,
                action.payload
            );
        }

        case WeatherActions.TOGGLE_LOADING: {
            if (action.isLoading != null) {
                return Object.assign(
                    {},
                    state,
                    { loading: action.isLoading }
                );
            }
            return Object.assign(
                {},
                state,
                { loading: !state.loading }
            );
        }

        default: {
            return state;
        }
    }
}