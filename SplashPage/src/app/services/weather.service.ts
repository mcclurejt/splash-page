import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/fromPromise';

export interface Weather {
  city: string;
  country: string;
  temp: string;
  iconClass: string;
}

@Injectable()
export class WeatherService {

  static weatherApiKey = '&APPID=dd6e2828f19f1157a6935e1e7d8f6b9e';
  static weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='
  static ipLocationUrl = 'https://ipinfo.io/json'
  static units = 'imperial';

  public weatherStream: Observable<Weather>;
  startTime;

  constructor(private http: Http) {
    this.weatherStream = Observable.fromPromise(new Promise((resolve, reject) => {
      this.getIpLocation()
        .map((resp) => this.mapLocation(resp))
        .map((coords) => this.getWeather(coords))
        .subscribe((resp) => {
          resp.map((resp) => this.mapWeather(resp))
            .subscribe((weather) => {
              resolve(weather);
            });
        });
    }));
  }

  getIpLocation(): Observable<Response> {
    return this.http.get(WeatherService.ipLocationUrl);
  }

  getWeather(coords): Observable<Response> {
    return this.http.get(this._getUrl(coords));
  }

  private mapWeather(res: Response): Weather {
    let body = res.json();
    let weather: Weather = {
      city: body.name,
      country: body.sys.country,
      temp: String(body.main.temp).split('.')[0],
      iconClass: 'wi wi-owm-' + body.weather[body.weather.length - 1].id,
    }
    return weather;
  }

  private mapLocation(res: Response) {
    let body = res.json();
    let coordArray = body.loc.split(",");
    let coords = {
      latitude: coordArray[0],
      longitude: coordArray[1]
    }
    return coords;
  }

  private _getUrl(coords): string {
    return WeatherService.weatherBaseUrl +
      coords.latitude + '&lon=' +
      coords.longitude + '&units=' +
      WeatherService.units +
      WeatherService.weatherApiKey;
  }
}
