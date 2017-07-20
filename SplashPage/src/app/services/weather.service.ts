import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/fromPromise';

export interface Weather {
  city: string;
  region: string;
  temp: string;
  icon: string;
}

@Injectable()
export class WeatherService {

  static weatherBaseUrl = 'https://crossorigin.me/https://api.darksky.net/forecast/ffd941872a25813256d6d849d37140cf/'
  static ipLocationUrl = 'https://ipinfo.io/json'
  private city;
  private region;

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
      city: this.city,
      region: this.region,
      temp: String(body.currently.temperature).split('.')[0],
      icon: 'wi wi-forecast-io-' + body.currently.icon,
    }
    console.log('Weather Icon',weather.icon);
    return weather;
  }

  private mapLocation(res: Response) {
    let body = res.json();
    this.city = body.city;
    this.region = body.region;
    let coords = body.loc;
    return coords;
  }

  private _getUrl(coords): string {
    return WeatherService.weatherBaseUrl + coords + '/?exclude=minutely,hourly,daily,alerts,flags';
  }
}
