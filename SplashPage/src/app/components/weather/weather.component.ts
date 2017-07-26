import { Observable } from 'rxjs/Observable';
import { WeatherService, Weather } from '../../services/weather.service';
import { Component} from '@angular/core';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
})

export class WeatherComponent {
  public weather: Weather;
  public isLoadingStream: Observable<boolean>;
  constructor(public weatherService: WeatherService) {
    this.weatherService.getWeatherStream().subscribe( (weather: Weather) => {
      this.weather = weather;
    });
    this.weatherService.isLoadingSubject.subscribe( (isLoading) => {
      console.log('WeatherComponent isLoading',isLoading);
    });
  }

}
