import { Observable } from 'rxjs/Observable';
import { WeatherService, Weather } from '../services/weather.service';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService],
})

export class WeatherComponent implements OnDestroy {

  weatherSubscription: Subscription;
  city: string;
  country: string;
  temp: string;
  iconClass: string;

  constructor(public weatherService: WeatherService) {
    this.weatherService.weatherStream.subscribe( (weather: Weather) => {
      this.city = weather.city;
      this.country = weather.country;
      this.temp = weather.temp;
      this.iconClass = weather.iconClass;
    })
  }

  ngOnInit(): void{
    
  }

  ngOnDestroy(): void {
    if(this.weatherSubscription){
      this.weatherSubscription.unsubscribe();
    }
  }

}
