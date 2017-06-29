import { Observable } from 'rxjs/Observable';
import { WeatherService } from './weather.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

export interface Weather {
  city: string;
  country: string;
  temp: string;
  iconClass: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
})

export class WeatherComponent implements OnInit, OnDestroy {
  geoEnabled = false;
  geoOptions = {
    timeout: 10 * 1000,
  }
  weather : Weather = {
    'city' : '',
    'country' : '',
    'temp' : '',
    'iconClass' : '',
  }

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.loadWeather();
  }

  ngOnDestroy() {
  }

  loadWeather() {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      this.getWeatherData(latitude, longitude);
      this.geoEnabled = true;
    }, (error) => {
      this.locationError(error);
    }, this.geoOptions)
  }

  getWeatherData(latitude, longitude) {
    this.weatherService.load(latitude, longitude).then(weather => {
      this.weather = weather;
    })
  }

  locationError(error) {
    if (error.code == error.PERMISSION_DENIED) {
      this.weatherService.getIPLocation().then(coordinates => {
        this.getWeatherData(coordinates.latitude, coordinates.longitude);
      })
    } else {
      console.log('Error in retreiving weather data',error)
    }
  }

}
