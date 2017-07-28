import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/switchMap';

import { Store } from "@ngrx/store";
import * as WeatherActions from '../store/weather.actions';
import * as fromRoot from '../store/reducers';


@Injectable()
export class WeatherService {
  private weatherBaseUrl = 'https://crossorigin.me/https://api.darksky.net/forecast/ffd941872a25813256d6d849d37140cf/'
  private ipLocationUrl = 'https://ipinfo.io/json'
  private city;
  private region;

  constructor(
    private http: Http
  ) { }

  public getWeatherStream(): Observable<any> {
    return this.requestIpLocation()
      .map((resp) => this.mapLocation(resp))
      .switchMap((coords) => this.requestWeather(coords))
      .map((resp) => this.mapWeather(resp));
  }

  private requestIpLocation(): any {
    return this.http.get(this.ipLocationUrl);
  }

  private mapLocation(resp: Response): any {
    let body = resp.json();

    this.city = body.city;
    this.region = body.region;

    let coords = body.loc;
    return coords;
  }

  private requestWeather(coords): any {
    return this.http.get(this._getUrl(coords));
  }

  private _getUrl(coords): string {
    return this.weatherBaseUrl + coords + '/?exclude=minutely,hourly,daily,alerts,flags';
  }

  private mapWeather(resp): any {
    let body = resp.json();
    return {
      city: this.city,
      region: this.region,
      temp: String(body.currently.temperature).split('.')[0],
      icon: 'wi wi-forecast-io-' + body.currently.icon,
    };
  }
}
