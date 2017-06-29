import { Observable } from 'rxjs/Observable';
import { WeatherService } from './weather.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

interface WeatherData {
  weather
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
})

export class WeatherComponent implements OnInit, OnDestroy {
  showGeolocation: boolean;
  observableLocation: Observable<any>;
  observableWeather: Observable<any>;
  city = '';
  country = '';
  temp = '';
  iconClass = '';

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    if (navigator.geolocation) {
      this.showGeolocation = true;
      //this.updateLocationAndWeather();
      this.loadWeather()
    } else {
      this.showGeolocation = false;
    }
  }

  ngOnDestroy() {
  }

  loadWeather(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.weatherService.load(position).then( weatherData => {
        this.city = weatherData.name;
        this.country = weatherData.sys.country;
        this.temp = weatherData.main.temp;
        this.iconClass ='wi wi-owm-' + weatherData.cod;
        console.log('weatherData',weatherData);
      })
    })
  }

}
