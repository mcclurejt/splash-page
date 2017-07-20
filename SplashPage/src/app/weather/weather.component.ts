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
  region: string;
  temp: string;
  icon: string;

  constructor(public weatherService: WeatherService) {
    this.weatherService.weatherStream.subscribe( (weather: Weather) => {
      this.city = weather.city;
      this.region = weather.region;
      this.temp = weather.temp;
      this.icon = weather.icon;
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
