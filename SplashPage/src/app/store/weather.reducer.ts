import * as WeatherActions from './weather.actions';

export interface State {
    city: string,
    region: string,
    temp: string,
    icon: string,
    loading: boolean,
}

const initialState: State = {
    city: '',
    region: '',
    temp: '',
    icon: '',
    loading: false,
}

export function reducer(state = initialState, action: WeatherActions.All): State {
    switch (action.type) {
        case WeatherActions.UPDATE: {
            return Object.assign(
                {},
                state,
                action.payload
            );
        }

        case WeatherActions.TOGGLE_LOADING: {
            if (action.payload != null) {
                return Object.assign(
                    {},
                    state,
                    { loading: action.payload }
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