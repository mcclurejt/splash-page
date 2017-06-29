import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {

  mapsApiKey = 'AIzaSyCQyVbMdr7JFtL0lA-VCW8RmTq2o3xnGgE';
  weatherApiKey = '&APPID=dd6e2828f19f1157a6935e1e7d8f6b9e';
  constructor(private http: Http) { }

  getLocationFromCoords(latitude: number, longitude: number): Observable<any> {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=` + String(latitude) + `,` + String(longitude) + `&key=` + this.mapsApiKey;
    return this.http.get(url).map(this.extractData);
  }

  getLocalWeather(zipcode: string, country: string): Observable<any> {
    let url = 'http://api.openweathermap.org/data/2.5/weather?zip='+ zipcode + ',' + country + this.weatherApiKey;
    console.log('url',url);
    return this.http.get(url).map(this.extractData);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body
  }

}
