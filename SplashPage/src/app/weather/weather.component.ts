import { WeatherService } from '../services/weather.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
})

export class WeatherComponent implements OnInit, OnDestroy {
  geoOptions = {
    timeout: 10 * 1000,
  }
  weatherSub: Subscription;
  weather = {
    city: 'Chicago',
    country: 'US',
    temp: '75',
    iconClass: 'wi wi-owm-802',
  }

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.getWeather();
  }

  private getWeather() {
    navigator.geolocation.getCurrentPosition(
      position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        this.weatherSub = this.weatherService.getWeather(latitude, longitude).subscribe(
          weather => {
            console.log(weather);
            this.weather = weather;
          }
        );
      },
      error => {
        this.locationError(error);
      },
      this.geoOptions)
  }

  locationError(error) {
    if (error.code == error.PERMISSION_DENIED) {
      this.weatherSub = this.weatherService.getIPLocation().subscribe(
        coordinates => {
          this.weatherSub = this.weatherService.getWeather(coordinates.latitude, coordinates.longitude).subscribe(
            weather => {
              console.log(weather);
              this.weather = weather;
            }
          );
        });
    } else {
      console.log('Error in retreiving weather data', error)
    }
  }

  ngOnDestroy() {
    this.weatherSub.unsubscribe();
  }

}
