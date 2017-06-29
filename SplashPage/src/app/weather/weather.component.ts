import { Observable } from 'rxjs/Observable';
import { WeatherService } from './weather.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

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
  location: any;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  weather: any;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    if ('geolocation' in navigator) {
      this.showGeolocation = true;
    } else {
      this.showGeolocation = false;
    }
  }

  ngOnDestroy() {
  }

  localizeWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        this.observableLocation = this.weatherService.getLocationFromCoords(latitude, longitude);
        this.observableLocation.subscribe(
          location => {
            this.location = location;
            this.city = location.results[0].address_components[2].short_name
            this.state = location.results[0].address_components[5].short_name
            this.zipcode = location.results[3].address_components[0].short_name
            this.country = location.results[3].address_components[3].short_name
            this.observableWeather = this.weatherService.getLocalWeather(this.zipcode, this.country)
            this.observableWeather.subscribe( weather => {
              this.weather = weather;
              console.log(this.weather);
            })
            // console.log('Location Object',this.location);
            // console.log('City',this.city);
            // console.log('State',this.state);
            // console.log('Zip Code',this.zipcode);
            // console.log('Country',this.country);
          });
      });
    }
  }

}
