import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Weather, Coordinates } from './weather.component'
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  weatherApiKey = '&APPID=dd6e2828f19f1157a6935e1e7d8f6b9e';
  weatherBaseUrl = 'http://api.openweathermap.org/data/2.5/weather?lat='
  units = 'imperial';

  constructor(private http: Http) { }

  load(latitude, longitude): Promise<Weather> {
    return new Promise(resolve => {
      let url = this.weatherBaseUrl + latitude + '&lon=' + longitude + '&units=' + this.units + this.weatherApiKey;
      this.http.get(url)
        .map(this.mapWeatherData)
        .subscribe(weatherData => {
          resolve(weatherData);
        })
    })
  }

  getIPLocation(): Promise<Coordinates> {
    return new Promise(resolve => {
      let url = 'http://ipinfo.io/json'
      this.http.get(url)
        .map(this.mapLocationData)
        .subscribe(locationData => {
          resolve(locationData)
        })
    })
  }

  private mapWeatherData(res: Response): Weather{
    let body = res.json();
    let weather : Weather = {
      city : body.name,
      country: body.sys.country,
      temp: String(body.main.temp).split('.')[0],
      iconClass: 'wi wi-owm-' + body.weather[body.weather.length-1].id,
    }
    return weather;
  }

  private mapLocationData(res: Response): Coordinates {
    let body = res.json();
    let coordArray = body.loc.split(",");
    let coordinates: Coordinates = {
      latitude: coordArray[0],
      longitude: coordArray[1],
    }
    return coordinates;
  }
}
