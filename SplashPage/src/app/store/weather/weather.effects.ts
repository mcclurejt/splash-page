import { WeatherService } from './../../services/weather.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect, toPayload } from "@ngrx/effects";
import * as WeatherActions from 'app/store/weather/weather.actions';
import { Store } from "@ngrx/store";
import * as fromRoot from 'app/store/reducers';

import 'rxjs/add/operator/switchMap';

@Injectable()
export class WeatherEffects {

  constructor(private weatherService: WeatherService, private actions: Actions, public store: Store<fromRoot.State>) { }

  @Effect() onStateChange: Observable<WeatherActions.All> = this.actions.ofType(WeatherActions.ON_STATE_CHANGE)
    .map(toPayload)
    .switchMap(() => {
        this.store.dispatch(new WeatherActions.StartLoading());
        return this.weatherService.getWeatherStream();
    })
    .map(weather => {
        this.store.dispatch(new WeatherActions.EndLoading());
        return new WeatherActions.Update(weather)
    });
}