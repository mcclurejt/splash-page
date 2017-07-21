import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
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
  private weather: Weather;
  public weatherStream: Observable<Weather>;

  constructor(private http: Http) {
    if(this.weather != null){
      this.weatherStream = Observable.of(this.weather);
    }
    this.weatherStream = this.requestIpLocation()
      .map((resp) => this.mapLocation(resp))
      .switchMap((coords) => this.requestWeather(coords))
      .map((resp) => this.mapWeather(resp))
      .share();
  }

  requestIpLocation(): Observable<Response> {
    return this.http.get(WeatherService.ipLocationUrl);
  }

  requestWeather(coords): Observable<Response> {
    return this.http.get(this._getUrl(coords));
  }

  private mapLocation(res: Response) {
    let body = res.json();
    this.city = body.city;
    this.region = body.region;
    let coords = body.loc;
    return coords;
  }

  private mapWeather(res: Response): Weather {
    let body = res.json();
    let weather: Weather = {
      city: this.city,
      region: this.region,
      temp: String(body.currently.temperature).split('.')[0],
      icon: 'wi wi-forecast-io-' + body.currently.icon,
    }
    this.weather = weather;
    return weather;
  }

  private _getUrl(coords): string {
    return WeatherService.weatherBaseUrl + coords + '/?exclude=minutely,hourly,daily,alerts,flags';
  }
}
