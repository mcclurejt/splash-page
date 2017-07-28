import { Action } from './../models/action';
import { ADD } from './../stores/weather.store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/switchMap';
import { Store } from "@ngrx/store";
import { Weather } from "app/models/weather";


@Injectable()
export class WeatherService {
  private weatherBaseUrl = 'https://crossorigin.me/https://api.darksky.net/forecast/ffd941872a25813256d6d849d37140cf/'
  private ipLocationUrl = 'https://ipinfo.io/json'
  private city;
  private region;
  public isLoadingSubject = new BehaviorSubject<boolean>(true);
  public weatherStream: Observable<Weather>;

  constructor(private http: Http, private store: Store<any>) {
    this.weatherStream = store.select('weather');
  }

  public loadWeatherStream(): void{
    this.requestIpLocation()
      .map((resp) => this.mapLocation(resp))
      .switchMap((coords) => this.requestWeather(coords))
      .map((resp) => this.mapWeather(resp))
      .map((weather) => {return new Action({type: ADD, payload: weather})})
      .subscribe(action => this.store.dispatch(action));
  }

  private requestIpLocation(): Observable<Response> {
    return this.http.get(this.ipLocationUrl);
  }

  private requestWeather(coords): Observable<Response> {
    return this.http.get(this._getUrl(coords));
  }

  private mapLocation(res: Response): any {
    let body = res.json();
    this.city = body.city;
    this.region = body.region;
    let coords = body.loc;
    return coords;
  }

  private mapWeather(res: Response): Weather {
    this.isLoadingSubject.next(false);
    let body = res.json();
    return {
      city: this.city,
      region: this.region,
      temp: String(body.currently.temperature).split('.')[0],
      icon: 'wi wi-forecast-io-' + body.currently.icon,
    }
  }

  private _getUrl(coords): string {
    return this.weatherBaseUrl + coords + '/?exclude=minutely,hourly,daily,alerts,flags';
  }
}
