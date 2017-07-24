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

  constructor(public weatherService: WeatherService) {}

}
