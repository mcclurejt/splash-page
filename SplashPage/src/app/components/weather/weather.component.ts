import { Observable } from 'rxjs/Observable';
import { WeatherService } from '../../services/weather.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Store } from "@ngrx/store";
import * as WeatherActions from 'app/store/weather/weather.actions';
import * as fromRoot from 'app/store/reducers';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
})

export class WeatherComponent {

  city: Observable<string>;
  region: Observable<string>;
  temp: Observable<string>;
  icon: Observable<string>;
  loading: Observable<boolean>;

  constructor(private weatherService: WeatherService) {
    this.city = this.weatherService.weather.map(weather => weather.city);
    this.region = this.weatherService.weather.map(weather => weather.region);
    this.temp = this.weatherService.weather.map(weather => weather.temp);
    this.icon = this.weatherService.weather.map(weather => weather.icon);
    this.loading = this.weatherService.loading;
  }

}
