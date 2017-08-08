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
      console.log(WeatherActions.UPDATE);
      return Object.assign(
        {},
        state,
        action.payload,
      );
    }

    case WeatherActions.START_LOADING: {
      console.log(WeatherActions.START_LOADING);
      return Object.assign(
        {},
        state,
        { loading: true }
      );
    }

    case WeatherActions.END_LOADING: {
      console.log(WeatherActions.END_LOADING);
      return Object.assign(
        {},
        state,
        { loading: false }
      );
    }

    default: {
      return state;
    }
  }
}