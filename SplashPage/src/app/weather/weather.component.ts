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
  geoEnabled = false;
  geoOptions = {
    timeout: 10 * 1000,
  }
  city = '';
  country = '';
  temp = '';
  iconClass = '';

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
    this.weatherService.load(latitude, longitude).then(weatherData => {
      this.city = weatherData.name;
      this.country = weatherData.sys.country;
      this.temp = String(weatherData.main.temp).split('.')[0];
      this.iconClass = 'wi wi-owm-' + weatherData.weather[weatherData.weather.length-1].id;
      console.log('weatherData', weatherData);
    })
  }

  locationError(error) {
    if (error.code == error.PERMISSION_DENIED) {
      this.weatherService.getIPLocation().then(locationData => {
        console.log(locationData);
        let coords = locationData.loc.split(",");
        let latitude = coords[0]
        let longitude = coords[1]
        this.getWeatherData(latitude, longitude);
      })
    } else {
      console.log('Error in retreiving weather data',error)
    }
  }

}
