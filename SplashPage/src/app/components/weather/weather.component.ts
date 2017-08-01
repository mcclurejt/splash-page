import { Observable } from 'rxjs/Observable';
import { WeatherService } from '../../services/weather.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Store } from "@ngrx/store";
import * as WeatherActions from 'app/store/weather.actions';
import * as fromRoot from 'app/store/reducers';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
})

export class WeatherComponent implements OnInit {

  city: Observable<string>;
  region: Observable<string>;
  temp: Observable<string>;
  icon: Observable<string>;
  loading: Observable<boolean>;

  constructor(
    private weatherService: WeatherService,
    private store: Store<fromRoot.State>
  ) {
    this.city = store.select(state => state.weather.city);
    this.region = store.select(state => state.weather.region);
    this.temp = store.select(state => state.weather.temp);
    this.icon = store.select(state => state.weather.icon);
    this.loading = store.select(state => state.weather.loading);
  }

  ngOnInit(){
    this.updateWeather();
  }

  updateWeather() {
    this.store.dispatch(new WeatherActions.ToggleLoading(false));

    this.weatherService.getWeatherStream()
      .subscribe((results) => {
        this.store.dispatch(new WeatherActions.ToggleLoading(false));
        this.store.dispatch(new WeatherActions.Update(results));
      });
  }

}
